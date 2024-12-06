import { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import CardType from "@entitys/CardType";
import Player, { CardSlot, isCardSlot } from "@entitys/player";

export default class InvestigarHandler implements ActionHandler {
    validate({
        game,
        player,
        card,
        selfCard,
        target,
        targetCard
    }: ActionRequest): void {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (targetCard === undefined)
            throw new Error("Uma das cartas do inimigo deve ser escolhida");

        if (!isCardSlot(targetCard))
            throw new Error("O index da carta do inimigo deve ser 0 ou 1");

        if (!game.getConfigs().tiposCartas[card].investigar)
            throw new Error("O tipo de carta escolhida não pode investigar");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (target.getCard(targetCard).getIsKilled())
            throw new Error("A carta do inimigo escolhida já está morta");
    }

    save({
        game,
        card,
        selfCard,
        target,
        targetCard
    }: ValidActionRequest) {
        game.getLastTurn().addAction(Action.INVESTIGAR);
        game.getLastTurn().addTarget(target as Player);
        game.getLastTurn().addCardType(card as CardType);
        game.getLastTurn().addCard(selfCard as CardSlot);
        game.getLastTurn().addCard(targetCard as CardSlot);
    }

    finish(): boolean {
        return true;
    }

    actionInfos({
        player,
        card,
        target,
        targetCard
    }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.INVESTIGAR,
            card: card,
            target: (target as Player).name,
            attackedCard: targetCard,
            isInvestigating: false
        };
    }
}