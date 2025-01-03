import type { ActionInfos } from "@services/GameMessageService";
import GameService from "@services/GameService";
import PlayerService from "@services/PlayerService";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import type Player from "@entitys/player";
import type Turn from "@entitys/Turn";
import ActionHandlerFacade from "@actionHandlers/ActionHandlerFacade";
import { TurnState } from "@actionHandlers/ActionHandler";

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
            target
        } = ActionService.getInfosForAction(socketId, action, targetName);

        const preLastTurn = game.getTurn(-2);

        if (
            preLastTurn !== undefined
            &&
            turn !== preLastTurn
        )
            preLastTurn.finish(false);

        ActionService.validateSocketTurn(PlayerService.getPlayer(socketId), turn);

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
                targetCard
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
                game.nextPlayer();

            throw error;
        }

        switch (turnState) {
            case TurnState.TURN_FINISHED:
                turn.finish();
                break;
            case TurnState.TURN_WAITING_REPLY:
                ActionService.lobbys[lobbyId] = {
                    turn: turn,
                    isWaitingTimeOut: false
                };
                break;
            case TurnState.TURN_WAITING_TIMEOUT:
                game.nextPlayer();
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

    private static validateSocketTurn(socketPlayer: Player, turn: Turn) {
        const [ player, target ] = [ turn.getPlayer(), turn.getTarget() ];

        if (
            socketPlayer === player
            &&
            turn.getAllActions().length%2 === 0
        )
            return;

        if (
            target !== undefined
            &&
            socketPlayer === target
            &&
            turn.getAllActions().length%2 === 1
        )
            return;

        if (
            target === undefined
            &&
            socketPlayer !== player
            &&
            turn.getAllActions().length%2 === 1
        )
            return;

        if (
            turn.getAllActions().length === 3
            &&
            socketPlayer === turn.getPlayer()
        )
            return;

        throw new Error("Não é a vez do player");
    }

    private static getInfosForAction(socketId: string, action: Action, targetName: string | undefined) {
        const { id: lobbyId } = PlayerService.getPlayersLobby(socketId);

        const game = GameService.getPlayersGame(socketId);

        if (game === undefined)
            throw new Error("Player is not playing a game");

        let turn: Turn = game.getLastTurn();
        const cur = ActionService.lobbys[lobbyId];
        let isWaitingTimeOut = undefined;

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

        const player = PlayerService.getPlayer(socketId);

        let target: Player | undefined = undefined;

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
            target
        }
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

    static revertTurn(lobbyId: number) {
        lobbyId;
    }
}