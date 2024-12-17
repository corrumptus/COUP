import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";

export default class trocarPropriaReligiaoHandler implements ActionHandler {
    validate({
        configs,
        player
    }: ActionRequest): void {
        if (!configs.religiao.reforma)
            throw new Error("O jogo não passou pela reforma e não possui religião");

        if (player.getMoney() < configs.religiao.quantidadeTrocarPropria)
            throw new Error("O player não tem dinheiro suficiente para trocar sua própria religião");
    }

    save({
        turn,
        configs,
        player
    }: ValidActionRequest) {
        player.removeMoney(configs.religiao.quantidadeTrocarPropria);
        player.changeReligion();

        turn.addAction(Action.TROCAR_PROPRIA_RELIGIAO);
    }

    finish(): TurnState {
        return TurnState.TURN_FINISHED;
    }

    actionInfos({
        player
    }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.TROCAR_PROPRIA_RELIGIAO,
            card: undefined,
            target: undefined,
            attackedCard: undefined,
            isInvestigating: false,
            winContesting: false
        }
    }
}