import type { ActionInfos } from "@services/GameMessageService";
import GameService from "@services/GameService";
import PlayerService from "@services/PlayerService";
import ActionHandler from "@actionHandlers/ActionHandler";
import ActionHandlerFactory from "@actionHandlers/ActionHandlerFactory";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import type Game from "@entitys/Game";
import type Player from "@entitys/player";
import type { CardSlot } from "@entitys/player";
import type Turn from "@entitys/Turn";

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
    ): ActionInfos {
        const {
            lobbyId,
            game,
            player,
            target
        } = ActionService.getInfosForAction(socketId, action, targetName);

        ActionService.validateSocketTurn(PlayerService.getPlayer(socketId), game.getLastTurn());

        const actionHandler: ActionHandler = ActionHandlerFactory.create(action);

        actionHandler.validate({
            game,
            player,
            card,
            selfCard,
            target,
            targetCard
        });

        actionHandler.save({
            game,
            player,
            card,
            selfCard: selfCard as CardSlot | undefined,
            target,
            targetCard: targetCard as CardSlot | undefined
        });

        if (
            lobbyId in ActionService.lobbys
            &&
            game.getLastTurn() !== ActionService.lobbys[lobbyId]
        ) {
            ActionService.lobbys[lobbyId].finish(false);
            delete ActionService.lobbys[lobbyId];
        }

        const needTowait = actionHandler.finish(game);

        if (needTowait)
            ActionService.lobbys[lobbyId] = game.getLastTurn();

        return actionHandler.actionInfos({
            game,
            player,
            card,
            selfCard: selfCard as CardSlot | undefined,
            target,
            targetCard: targetCard as CardSlot | undefined
        });
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

        const turn = ActionService.getCorrectTurn(game, action);

        if (turn !== game.getLastTurn())
            game.removeLastTurn();

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
            player,
            target
        }
    }

    private static getCorrectTurn(game: Game, action: Action): Turn {
        const lastTurn = game.getLastTurn();
        const preLastTurn = game.getTurn(-2);

        if (
            preLastTurn !== undefined
            &&
            !preLastTurn.isfinished
            &&
            ActionService.isDefenseAction(action)
        )
            return preLastTurn;

        return lastTurn;
    }

    private static isDefenseAction(action: Action): boolean {
        return [Action.CONTESTAR, Action.BLOQUEAR, Action.CONTINUAR].includes(action);
    }
}