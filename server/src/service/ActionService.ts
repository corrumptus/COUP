import type { ActionInfos } from "@services/GameMessageService";
import GameService from "@services/GameService";
import PlayerService from "@services/PlayerService";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import type Player from "@entitys/player";
import type Turn from "@entitys/Turn";
import ActionHandlerFacade from "@actionHandlers/ActionHandlerFacade";
import { TurnState } from "@actionHandlers/ActionHandler";
import Game from "@entitys/Game";

export type ActionResults = {
    turn: Turn,
    actionInfos: ActionInfos
}

export default class ActionService {
    static lobbys: {
        [id: number]: {
            turn: Turn,
            isWaitingTimeOut: boolean
        }
    } = {};

    static makeAction(
        socketId: string,
        action: Action,
        card?: CardType,
        selfCard?: number,
        targetName?: string,
        targetCard?: number
    ): ActionResults {
        const {
            lobbyId,
            game,
            turn,
            isWaitingTimeOut,
            player,
            target,
            globalThirdPerson
        } = ActionService.getInfosForAction(socketId, action, targetName);

        const preLastTurn = game.getTurn(-2);

        if (
            preLastTurn !== undefined
            &&
            turn !== preLastTurn
        )
            ActionService.nextPlayer(undefined, preLastTurn);

        ActionService.validateSocketTurn(PlayerService.getPlayer(socketId), turn, action);

        let actionInfos, turnState;

        try {
            const handleResult = new ActionHandlerFacade(
                game,
                turn,
                action,
                player,
                card,
                selfCard,
                target,
                targetCard,
                globalThirdPerson
            ).handle();

            actionInfos = handleResult.actionInfos;
            turnState = handleResult.turnState;
        } catch (error) {
            if (isWaitingTimeOut !== undefined)
                ActionService.lobbys[lobbyId] = {
                    turn: turn,
                    isWaitingTimeOut: isWaitingTimeOut
                };

            if (isWaitingTimeOut !== undefined && isWaitingTimeOut)
                ActionService.nextPlayer(game, undefined);

            throw error;
        }

        switch (turnState) {
            case TurnState.TURN_FINISHED:
                ActionService.nextPlayer(game, turn);
                break;
            case TurnState.TURN_WAITING_REPLY:
                ActionService.lobbys[lobbyId] = {
                    turn: turn,
                    isWaitingTimeOut: false
                };
                break;
            case TurnState.TURN_WAITING_TIMEOUT:
                ActionService.nextPlayer(game, undefined);
                ActionService.lobbys[lobbyId] = {
                    turn: turn,
                    isWaitingTimeOut: true
                };
                break;
        }

        return {
            turn: turn,
            actionInfos: actionInfos
        }
    }

    private static getInfosForAction(socketId: string, action: Action, targetName: string | undefined) {
        const { id: lobbyId } = PlayerService.getPlayersLobby(socketId);

        const game = GameService.getPlayersGame(socketId);

        if (game === undefined)
            throw new Error("Player is not playing a game");

        let turn: Turn = game.getLastTurn();
        const cur = ActionService.lobbys[lobbyId];
        let isWaitingTimeOut = undefined;
        let globalThirdPerson = undefined;

        if (cur !== undefined) {
            if (
                cur.isWaitingTimeOut &&
                ActionService.iswaitingTimeoutAction(cur.turn.getLastAction()) &&
                ActionService.isCounterAction(action)
            ) {
                turn = cur.turn;
                game.removeLastTurn();
            }

            if (
                !cur.isWaitingTimeOut &&
                ActionService.isWaitingReplyAction(cur.turn.getLastAction()) &&
                ActionService.isReplyAction(action)
            )
                turn = cur.turn;

            if (
                !cur.isWaitingTimeOut &&
                cur.turn.getLastAction() === Action.INVESTIGAR &&
                ActionService.isWaitingInvestigarReplyAction(action)
            )
                turn = cur.turn;

            isWaitingTimeOut = cur.isWaitingTimeOut;

            delete ActionService.lobbys[lobbyId];
        }

        let player = PlayerService.getPlayer(socketId);
        let target: Player | undefined = undefined;

        if (
            player !== turn.getPlayer() &&
            turn.getTarget() !== undefined &&
            player !== turn.getTarget() &&
            action === Action.CONTESTAR
        ) {
            globalThirdPerson = player;
            player = turn.getPlayer();
        }

        if (player !== turn.getPlayer())
            target = turn.getPlayer();
        else if (turn.getTarget() === undefined)
            target = PlayerService.getPlayerByName(targetName as string, lobbyId);
        else
            target = turn.getTarget();

        return {
            lobbyId,
            game,
            turn,
            isWaitingTimeOut,
            player,
            target,
            globalThirdPerson
        }
    }

    private static validateSocketTurn(socketPlayer: Player, turn: Turn, action: Action) {
        if (socketPlayer === turn.getCurrentPlayer())
            return;

        const isGlobalContester =
            turn.getContester() === undefined &&
            socketPlayer !== turn.getPlayer() &&
            action === Action.CONTESTAR

        if (isGlobalContester)
            return;

        const isGlobalBlocker =
            turn.getBlocker() === undefined &&
            socketPlayer !== turn.getPlayer() &&
            action === Action.BLOQUEAR

        if (isGlobalBlocker)
            return;

        const isGlobalBlockContester =
            turn.getBlockContester() === undefined &&
            socketPlayer !== turn.getTarget() &&
            action === Action.CONTESTAR

        if (isGlobalBlockContester)
            return;

        throw new Error("Não é a vez do player");
    }

    private static iswaitingTimeoutAction(action: Action | undefined): boolean {
        return ([
            Action.AJUDA_EXTERNA,
            Action.TAXAR,
            Action.CORRUPCAO,
            Action.TROCAR
        ] as (Action|undefined)[])
            .includes(action);
    }

    private static isCounterAction(action: Action): boolean {
        return [Action.BLOQUEAR, Action.CONTESTAR].includes(action);
    }

    private static isWaitingReplyAction(action: Action | undefined): boolean {
        return ([
            Action.EXTORQUIR,
            Action.ASSASSINAR,
            Action.INVESTIGAR,
            Action.BLOQUEAR
        ] as (Action|undefined)[])
            .includes(action);
    }

    private static isReplyAction(action: Action): boolean {
        return [Action.CONTESTAR, Action.BLOQUEAR, Action.CONTINUAR].includes(action);
    }

    private static isWaitingInvestigarReplyAction(action: Action | undefined): boolean {
        return ([
            Action.CONTESTAR,
            Action.CONTINUAR,
        ] as (Action|undefined)[])
            .includes(action);
    }

    private static nextPlayer(game: Game | undefined, turn: Turn | undefined) {
        turn?.finish();
        game?.nextPlayer();
    }

    static revertTurn(lobbyId: number) {
        lobbyId;
    }
}