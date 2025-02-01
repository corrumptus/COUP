import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { TurnState, ValidActionRequest, RequestInfos } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";

export default class AjudaExternaHandler implements ActionHandler {
    validate(): void {}

    save({ turn, configs, player }: ValidActionRequest): void {
        player.addMoney(configs.ajudaExterna);

        turn.addAction(Action.AJUDA_EXTERNA);
    }

    finish(): TurnState {
        return TurnState.TURN_WAITING_TIMEOUT;
    }

    actionInfos({ player }: RequestInfos): ActionInfos {
        return {
            attacker: player.name,
            action: Action.AJUDA_EXTERNA,
            card: undefined,
            target: undefined,
            attackedCard: undefined,
            isInvestigating: false,
            winContesting: false
        };
    }
}