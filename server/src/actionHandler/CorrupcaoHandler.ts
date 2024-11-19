import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import { CardSlot, isCardSlot } from "../entity/player";
import { ActionInfos } from "../service/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "./ActionHandler";

export default class CorrupcaoHandler implements ActionHandler {
    validate({
        game,
        player,
        card,
        selfCard
    }: ActionRequest): void {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (!game.getConfigs().religiao.reforma)
            throw new Error("Não é possível usar corrupção sem ter religião habilitado");

        if (!game.getConfigs().religiao.cartasParaCorrupcao[card])
            throw new Error("O tipo de carta escolhida não pode corromper");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (game.getAsylumCoins() === 0)
            throw new Error("O asilo não possui moedas para serem pegas");
    }

    save({
        game,
        player,
        card,
        selfCard
    }: ValidActionRequest) {
        player.addMoney(game.getAsylumCoins());

        game.resetAsylumCoins();

        game.getLastTurn().addAction(Action.CORRUPCAO);
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
            action: Action.CORRUPCAO,
            card: card,
            target: undefined,
            attackedCard: undefined,
            isInvestigating: false
        };
    }
}