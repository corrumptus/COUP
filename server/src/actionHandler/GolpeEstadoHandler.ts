import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import Player, { CardSlot, isCardSlot } from "@entitys/player";

export default class GolpeEstadoHandler implements ActionHandler {
    validate({
        configs,
        player,
        target,
        targetCard
    }: ActionRequest): void {
        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (
            configs.religiao.reforma &&
            player.getReligion() === target.getReligion() &&
            configs.religiao.deveres.golpeEstado
        )
            throw new Error(`O player ${target.name} tem a mesma religião. Não pode bloquear ajuda externa`);

        if (targetCard === undefined)
            throw new Error("Uma das cartas do inimigo deve ser escolhida");

        if (!isCardSlot(targetCard))
            throw new Error("O index da carta do inimigo deve ser 0 ou 1");

        if (player.getMoney() < configs.quantidadeMinimaGolpeEstado)
            throw new Error("O player não tem dinheiro suficiente para dar um golpe de estado");

        if (target.getCard(targetCard).getIsKilled())
            throw new Error("A carta do inimigo escolhida já está morta");
    }

    save({
        turn,
        configs,
        player,
        target,
        targetCard
    }: ValidActionRequest) {
        player.removeMoney(configs.quantidadeMinimaGolpeEstado);

        (target as Player).killCard(targetCard as CardSlot);

        turn.addAction(Action.GOLPE_ESTADO);
        turn.addTarget(target as Player);
        turn.addCard(targetCard as CardSlot);
    }

    finish(): TurnState {
        return TurnState.TURN_FINISHED;
    }

    actionInfos({
        player,
        target,
        targetCard
    }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.GOLPE_ESTADO,
            card: undefined,
            target: (target as Player).name,
            attackedCard: targetCard,
            isInvestigating: false,
            winContesting: false
        }
    }
}