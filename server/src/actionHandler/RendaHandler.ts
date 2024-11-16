import Action from "../entity/Action";
import Game from "../entity/Game";
import { ActionInfos } from "../service/GameMessageService";
import ActionHandler, { ValidActionRequest } from "./ActionHandler";

export default class RendaHandler implements ActionHandler {
    validate(): void {}

    save({ game, player}: ValidActionRequest): boolean {
        player.addMoney(game.getConfigs().renda);

        game.getLastTurn().addAction(Action.RENDA);

        return true;
    }

    finish(_: number, game: Game): void {
        game.getLastTurn().finish();
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