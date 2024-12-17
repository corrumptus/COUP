import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import Player, { CardSlot, isCardSlot } from "@entitys/player";

export default class InvestigarHandler implements ActionHandler {
    validate({
        configs,
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

        if (!configs.tiposCartas[card].investigar)
            throw new Error("O tipo de carta escolhida não pode investigar");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (target.getCard(targetCard).getIsKilled())
            throw new Error("A carta do inimigo escolhida já está morta");
    }

    save({
        turn,
        card,
        selfCard,
        target,
        targetCard
    }: ValidActionRequest) {
        turn.addAction(Action.INVESTIGAR);
        turn.addTarget(target as Player);
        turn.addCardType(card as CardType);
        turn.addCard(selfCard as CardSlot);
        turn.addCard(targetCard as CardSlot);
    }

    finish(): TurnState {
        return TurnState.TURN_WAITING_REPLY;
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
            isInvestigating: false,
            winContesting: false
        };
    }
}