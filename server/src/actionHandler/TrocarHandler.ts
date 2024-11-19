import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Player, { CardSlot, isCardSlot } from "../entity/player";
import { ActionInfos } from "../service/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "./ActionHandler";

export default class TrocarHandler implements ActionHandler {
    validate({
        game,
        player,
        card,
        selfCard,
        targetCard
    }: ActionRequest): void {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (!game.getConfigs().tiposCartas[card].trocar)
            throw new Error("O tipo de carta escolhida não pode trocar");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (
            game.getConfigs().tiposCartas[card].quantidadeTrocar === 1
            &&
            targetCard === undefined
        )
            throw new Error("Uma carta deve ser escolhida");

        if (
            game.getConfigs().tiposCartas[card].quantidadeTrocar === 1
            &&
            targetCard !== undefined
            &&
            !isCardSlot(targetCard)
        )
            throw new Error("O index da carta escolhida deve ser 0 ou 1");

        if (
            game.getConfigs().tiposCartas[card].quantidadeTrocar === 1
            &&
            targetCard !== undefined
            &&
            isCardSlot(targetCard)
            &&
            player.getCard(targetCard).getIsKilled()
        )
            throw new Error("A carta escolhida já está morta");
    }

    save({
        game,
        player,
        card,
        selfCard,
        target,
        targetCard
    }: ValidActionRequest): boolean {
        game.getLastTurn().addAction(Action.TROCAR);

        if (game.getLastTurn().getFirstAction() !== Action.TROCAR) {
            (target as Player).changeCard(targetCard as CardSlot);
            return false;
        }

        game.getLastTurn().addCard(selfCard as CardSlot);

        if (game.getConfigs().tiposCartas[card as CardType].quantidadeTrocar === 2) {
            player.changeCards();
            return false;
        }

        player.changeCard(targetCard as CardSlot);
        game.getLastTurn().addCard(targetCard as CardSlot);

        return false;
    }

    finish(game: Game): boolean {
        const firstAction = game.getLastTurn().getFirstAction() as Action;

        if (firstAction === Action.INVESTIGAR) {
            game.getLastTurn().finish();
            return false;
        }

        game.nextPlayer();

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
            action: Action.TROCAR,
            card: card,
            target: target?.name,
            attackedCard: targetCard,
            isInvestigating: false
        };
    }
}