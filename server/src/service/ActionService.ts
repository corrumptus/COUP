import ActionHandler from "../actionHandler/ActionHandler";
import ActionHandlerFactory from "../actionHandler/ActionHandlerFactory";
import Action from "../entity/Action";
import CardType from "../entity/CardType";
import { CardSlot } from "../entity/player";
import Turn from "../entity/Turn";
import ActionValidator from "../utils/ActionValidator";
import { ActionInfos } from "./GameMessageService";
import GameService from "./GameService";
import PlayerService from "./PlayerService";

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

        ActionValidator.validateSocketTurn(PlayerService.getPlayer(socketId), game.getLastTurn());

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

    static getInfosForAction(socketId: string, action: Action, targetName: string | undefined) {
        const { id: lobbyId } = PlayerService.getPlayersLobby(socketId);

        const game = GameService.getPlayersGame(socketId);

        if (game === undefined)
            throw new Error("Player is not playing a game");

        const turn = ActionValidator.getCorrectTurn(game, action);

        if (turn !== game.getLastTurn())
            game.removeLastTurn();

        const player = turn.getPlayer();

        const target = (
            targetName === undefined ?
                turn.getTarget()
                :
                PlayerService.getPlayerByName(targetName, lobbyId)
        ) || PlayerService.getPlayer(socketId);

        return {
            lobbyId,
            game,
            player,
            target
        }
    }
}