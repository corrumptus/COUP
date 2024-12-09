import { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import Game from "@entitys/Game";
import Player from "@entitys/player";

export default class trocarReligiaoOutroHandler implements ActionHandler {
    validate({
        game,
        player,
        target
    }: ActionRequest): void {
        if (!game.getConfigs().religiao.reforma)
            throw new Error("O jogo não passou pela reforma e não possui religião");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (!target.hasNonKilledCards)
            throw new Error("O inimigo já está morto");

        if (player.getMoney() < game.getConfigs().religiao.quantidadeTrocarOutro)
            throw new Error("O player não tem dinheiro suficiente para trocar a religião do inimigo");
    }

    save({
        game,
        player,
        target
    }: ValidActionRequest) {
        player.removeMoney(game.getConfigs().religiao.quantidadeTrocarOutro);
        (target as Player).changeReligion();

        game.getLastTurn().addAction(Action.TROCAR_RELIGIAO_OUTRO);
        game.getLastTurn().addTarget(target as Player);
    }

    finish(game: Game): boolean {
        game.getLastTurn().finish();

        return false;
    }

    actionInfos({
        player,
        target
    }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.TROCAR_RELIGIAO_OUTRO,
            card: undefined,
            target: (target as Player).name,
            attackedCard: undefined,
            isInvestigating: false
        };
    }
}