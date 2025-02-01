import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { RequestInfos, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";

export default class RendaHandler implements ActionHandler {
    validate(): void {}

    save({ turn, configs, player }: ValidActionRequest): void {
        player.addMoney(configs.renda);

        turn.addAction(Action.RENDA);
    }

    finish(): TurnState {
        return TurnState.TURN_FINISHED;
    }

    actionInfos({
        player
    }: RequestInfos): ActionInfos {
        return {
            attacker: player.name,
            action: Action.RENDA,
            card: undefined,
            target: undefined,
            attackedCard: undefined,
            isInvestigating: false,
            winContesting: false
        }
    }
}