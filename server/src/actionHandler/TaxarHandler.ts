import { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import CardType from "@entitys/CardType";
import Game from "@entitys/Game";
import { CardSlot, isCardSlot } from "@entitys/player";

export default class TaxarHandler implements ActionHandler {
    validate({
        game,
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

        if (!game.getConfigs().tiposCartas[card].taxar)
            throw new Error("O tipo de carta escolhida não pode taxar");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");
    }

    save({
        game,
        player,
        card,
        selfCard
    }: ValidActionRequest) {
        player.addMoney(game.getConfigs().tiposCartas[card as CardType].quantidadeTaxar);

        game.getLastTurn().addAction(Action.TAXAR);
        game.getLastTurn().addCardType(card as CardType);
        game.getLastTurn().addCard(selfCard as CardSlot);
    }

    finish(game: Game): boolean {
        game.nextPlayer();

        return true;
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
            isInvestigating: false
        };
    }
}