import Action from "../entity/Action";
import CardType from "../entity/CardType";
import ActionValidator from "../utils/ActionValidator";
import { ActionInfos } from "./GameMessageService";
import GameService from "./GameService";
import PlayerService from "./PlayerService";

export default class ActionService {
    static makeAction(
        socketId: string,
        action: Action,
        card?: CardType,
        selfCard?: number,
        targetName?: string,
        targetCard?: number
    ): ActionInfos {
        const game = GameService.getPlayersGame(socketId);

        if (game === null)
            throw new Error("Player is not playing a game");

        const player = PlayerService.getPlayer(socketId);

        const target = targetName === undefined ?
            undefined
            :
            PlayerService.getPlayerByName(targetName);

        ActionValidator.validate(game, player, action, card, selfCard, target, targetCard);

        game.getTurn(player)?.addAction(action);
    }
}