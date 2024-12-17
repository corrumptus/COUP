import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import Player, { CardSlot, isCardSlot } from "@entitys/player";

export default class TrocarHandler implements ActionHandler {
    private isInvestigating: boolean = false;

    validate({
        configs,
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

        if (!configs.tiposCartas[card].trocar)
            throw new Error("O tipo de carta escolhida não pode trocar");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (
            configs.tiposCartas[card].quantidadeTrocar === 1
            &&
            targetCard === undefined
        )
            throw new Error("Uma carta deve ser escolhida");

        if (
            configs.tiposCartas[card].quantidadeTrocar === 1
            &&
            targetCard !== undefined
            &&
            !isCardSlot(targetCard)
        )
            throw new Error("O index da carta escolhida deve ser 0 ou 1");

        if (
            configs.tiposCartas[card].quantidadeTrocar === 1
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
        turn,
        configs,
        player,
        card,
        selfCard,
        target,
        targetCard
    }: ValidActionRequest) {
        turn.addAction(Action.TROCAR);

        if (turn.getFirstAction() !== Action.TROCAR) {
            (target as Player).changeCard(targetCard as CardSlot);
            this.isInvestigating = true;
            return;
        }

        turn.addCard(selfCard as CardSlot);
        turn.addCardType(card as CardType);

        if (configs.tiposCartas[card as CardType].quantidadeTrocar === 2) {
            player.changeCards();
            return;
        }

        player.changeCard(targetCard as CardSlot);
        turn.addCard(targetCard as CardSlot);
    }

    finish(): TurnState {
        return this.isInvestigating ?
            TurnState.TURN_FINISHED
            :
            TurnState.TURN_WAITING_TIMEOUT;
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
            target: this.isInvestigating ? (target as Player).name : undefined,
            attackedCard: targetCard,
            isInvestigating: this.isInvestigating,
            winContesting: false
        };
    }
}