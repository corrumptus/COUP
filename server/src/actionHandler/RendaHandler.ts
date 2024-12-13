import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type Game from "@entitys/Game";

export default class RendaHandler implements ActionHandler {
    validate(): void {}

    save({ game, player }: ValidActionRequest): void {
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