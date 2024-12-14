import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type Game from "@entitys/Game";
import Player, { CardSlot, isCardSlot } from "@entitys/player";

export default class GolpeEstadoHandler implements ActionHandler {
    validate({
        game,
        player,
        target,
        targetCard
    }: ActionRequest): void {
        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (targetCard === undefined)
            throw new Error("Uma das cartas do inimigo deve ser escolhida");

        if (!isCardSlot(targetCard))
            throw new Error("O index da carta do inimigo deve ser 0 ou 1");

        if (player.getMoney() < game.getConfigs().quantidadeMinimaGolpeEstado)
            throw new Error("O player não tem dinheiro suficiente para dar um golpe de estado");

        if (target.getCard(targetCard).getIsKilled())
            throw new Error("A carta do inimigo escolhida já está morta");
    }

    save({
        game,
        player,
        target,
        targetCard
    }: ValidActionRequest) {
        player.removeMoney(game.getConfigs().quantidadeMinimaGolpeEstado);

        (target as Player).killCard(targetCard as CardSlot);

        game.getLastTurn().addAction(Action.GOLPE_ESTADO);
        game.getLastTurn().addTarget(target as Player);
        game.getLastTurn().addCard(targetCard as CardSlot);
    }

    finish(game: Game): boolean {
        game.getLastTurn().finish();

        return false;
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