import Action from "../entity/Action";
import Game from "../entity/Game";
import { ActionInfos } from "../service/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "./ActionHandler";

export default class trocarPropriaReligiaoHandler implements ActionHandler {
    validate({
        game,
        player
    }: ActionRequest): void {
        if (!game.getConfigs().religiao.reforma)
            throw new Error("O jogo não passou pela reforma e não possui religião");

        if (player.getMoney() < game.getConfigs().religiao.quantidadeTrocarPropria)
            throw new Error("O player não tem dinheiro suficiente para trocar sua própria religião");
    }

    save({
        game,
        player
    }: ValidActionRequest) {
        player.removeMoney(game.getConfigs().religiao.quantidadeTrocarPropria);
        player.changeReligion();

        game.getLastTurn().addAction(Action.TROCAR_PROPRIA_RELIGIAO);
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
            action: Action.TROCAR_PROPRIA_RELIGIAO,
            card: undefined,
            target: undefined,
            attackedCard: undefined,
            isInvestigating: false
        }
    }
}