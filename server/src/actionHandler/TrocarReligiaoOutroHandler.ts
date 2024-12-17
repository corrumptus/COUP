import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type Player from "@entitys/player";

export default class trocarReligiaoOutroHandler implements ActionHandler {
    validate({
        configs,
        player,
        target
    }: ActionRequest): void {
        if (!configs.religiao.reforma)
            throw new Error("O jogo não passou pela reforma e não possui religião");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (!target.hasNonKilledCards)
            throw new Error("O inimigo já está morto");

        if (player.getMoney() < configs.religiao.quantidadeTrocarOutro)
            throw new Error("O player não tem dinheiro suficiente para trocar a religião do inimigo");
    }

    save({
        turn,
        configs,
        player,
        target
    }: ValidActionRequest) {
        player.removeMoney(configs.religiao.quantidadeTrocarOutro);
        (target as Player).changeReligion();

        turn.addAction(Action.TROCAR_RELIGIAO_OUTRO);
        turn.addTarget(target as Player);
    }

    finish(): TurnState {
        return TurnState.TURN_FINISHED;
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
            isInvestigating: false,
            winContesting: false
        };
    }
}