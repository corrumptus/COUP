import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, RequestInfos, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import Player, { CardSlot, isCardSlot } from "@entitys/player";

export default class ExtorquirHandler implements ActionHandler {
    validate({
        configs,
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

        if (
            configs.religiao.reforma &&
            player.getReligion() === target.getReligion() &&
            configs.religiao.deveres.extorquir
        )
            throw new Error(`O player ${target.name} tem a mesma religião. Não pode extorquir`);

        if (!configs.tiposCartas[card].extorquir)
            throw new Error("O tipo de carta escolhida não pode extorquir");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");
    }

    save({
        turn,
        card,
        selfCard,
        target
    }: ValidActionRequest) {
        turn.addAction(Action.EXTORQUIR);
        turn.addTarget(target as Player);
        turn.addCardType(card as CardType);
        turn.addCard(selfCard as CardSlot);
    }

    finish(): TurnState {
        return TurnState.TURN_WAITING_REPLY;
    }

    actionInfos({
        player,
        card,
        target
    }: RequestInfos): ActionInfos {
        return {
            attacker: player.name,
            action: Action.EXTORQUIR,
            card: card,
            target: (target as Player).name,
            attackedCard: undefined,
            isInvestigating: false,
            winContesting: false
        };
    }
}