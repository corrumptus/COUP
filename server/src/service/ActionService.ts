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
        [id: number]: Turn
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
            player,
            target
        } = ActionService.getInfosForAction(socketId, targetName);

        ActionService.validateSocketTurn(PlayerService.getPlayer(socketId), turn);

        const { actionInfos, turnState } = new ActionHandlerFacade(
            game,
            turn,
            action,
            player,
            card,
            selfCard,
            target,
            targetCard
        ).handle();

        switch (turnState) {
            case TurnState.TURN_FINISHED:
                turn.finish();
                break;
            case TurnState.TURN_WAITING_REPLY: break;
            case TurnState.TURN_WAITING_TIMEOUT:
                ActionService.lobbys[lobbyId] = turn;
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

    private static getInfosForAction(socketId: string, targetName: string | undefined) {
        const { id: lobbyId } = PlayerService.getPlayersLobby(socketId);

        const game = GameService.getPlayersGame(socketId);

        if (game === undefined)
            throw new Error("Player is not playing a game");

        let turn = ActionService.lobbys[lobbyId];

        if (turn === undefined)
            turn = game.getLastTurn();
        else
            delete ActionService.lobbys[lobbyId];

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
            player,
            target
        }
    }
}