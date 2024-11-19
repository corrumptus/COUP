import Action from "../entity/Action";
import Game from "../entity/Game";
import { ActionInfos } from "../service/GameMessageService";
import ActionHandler, { ValidActionRequest } from "./ActionHandler";

export default class RendaHandler implements ActionHandler {
    validate(): void {}

    save({ game, player}: ValidActionRequest) {
        player.addMoney(game.getConfigs().renda);

        game.getLastTurn().addAction(Action.RENDA);
    }

    finish(game: Game): boolean {
        game.getLastTurn().finish();

        return false;
    }

    actionInfos({
        player
    }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.RENDA,
            card: undefined,
            target: undefined,
            attackedCard: undefined,
            isInvestigating: false
        }
    }
}