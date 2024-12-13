import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import Player, { CardSlot, isCardSlot } from "@entitys/player";

export default class ExtorquirHandler implements ActionHandler {
    validate({
        game,
        player,
        card,
        selfCard,
        target
    }: ActionRequest): void {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (!game.getConfigs().tiposCartas[card].extorquir)
            throw new Error("O tipo de carta escolhida não pode extorquir");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (target.getMoney() < game.getConfigs().tiposCartas[card].quantidadeExtorquir)
            throw new Error("O inimigo não tem dinheiro suficiente para ser extorquido");
    }

    save({
        game,
        card,
        selfCard,
        target
    }: ValidActionRequest) {
        game.getLastTurn().addAction(Action.EXTORQUIR);
        game.getLastTurn().addTarget(target as Player);
        game.getLastTurn().addCardType(card as CardType);
        game.getLastTurn().addCard(selfCard as CardSlot);
    }

    finish(): boolean {
        return false;
    }

    actionInfos({
        player,
        card,
        target
    }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.EXTORQUIR,
            card: card,
            target: (target as Player).name,
            attackedCard: undefined,
            isInvestigating: false
        };
    }
}