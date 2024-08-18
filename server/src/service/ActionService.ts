import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Turn from "../entity/Turn";
import ActionSaver from "../utils/ActionSaver";
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

        const turn = ActionService.getTheCorrectTurn(game);

        const player = turn.getPlayer();

        const target = targetName === undefined ?
            turn.getTarget()
            :
            PlayerService.getPlayerByName(targetName);

        ActionValidator.validate(player, action, card, selfCard, target, targetCard, turn, game.getConfigs(), game.getAsylumCoins());

        return ActionSaver.save();
    }

    private static getTheCorrectTurn(game: Game): Turn {
        const lastTurn = game.getTurn(-1) as Turn;
        const preLastTurn = game.getTurn(-2);

        if (preLastTurn === undefined || preLastTurn.isfinished)
            return lastTurn;

        game.removeLastTurn();

        return preLastTurn;
    }
}