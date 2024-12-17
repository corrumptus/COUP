import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import { CardSlot, isCardSlot } from "@entitys/player";

export default class TaxarHandler implements ActionHandler {
    validate({
        configs,
        player,
        card,
        selfCard,
    }: ActionRequest): void {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (!configs.tiposCartas[card].taxar)
            throw new Error("O tipo de carta escolhida não pode taxar");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");
    }

    save({
        turn,
        configs,
        player,
        card,
        selfCard
    }: ValidActionRequest) {
        player.addMoney(configs.tiposCartas[card as CardType].quantidadeTaxar);

        turn.addAction(Action.TAXAR);
        turn.addCardType(card as CardType);
        turn.addCard(selfCard as CardSlot);
    }

    finish(): TurnState {
        return TurnState.TURN_WAITING_TIMEOUT;
    }

    actionInfos({
        player,
        card
    }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.TAXAR,
            card: card,
            target: undefined,
            attackedCard: undefined,
            isInvestigating: false,
            winContesting: false
        };
    }
}