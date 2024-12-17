import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import Player, { CardSlot, isCardSlot } from "@entitys/player";
import type Config from "@utils/Config";

export default class BloquearHandler implements ActionHandler {
    validate({
        turn,
        configs,
        player,
        card,
        selfCard
    }: ActionRequest): void {
        const action = turn.getFirstAction();

        if (action === undefined)
            throw new Error("Bloquear não pode ser a primeira ação");

        if (this.dontNeedSelfCard(action))
            this.validateActionsDontNeedSelfCard(configs, action, card);
        else
            this.validateActionsNeedSelfCard(configs, player, action, card, selfCard);
    }

    private dontNeedSelfCard(action: Action): boolean {
        return [Action.ASSASSINAR, Action.INVESTIGAR].includes(action);
    }

    private validateActionsDontNeedSelfCard(
        configs: Config,
        action: Action,
        card: CardType | undefined
    ): void {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (!this.canBlock(
            action,
            card,
            configs
        ))
            throw new Error("O tipo de carta escolhida não pode bloquear está ação");
    }

    private validateActionsNeedSelfCard(
        configs: Config,
        player: Player,
        action: Action,
        card: CardType | undefined,
        selfCard: number | undefined
    ): void {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (!this.canBlock(action, card, configs))
            throw new Error("O tipo de carta escolhida não pode bloquear está ação");
    }

    private canBlock(action: Action, card: CardType, configs: Config): boolean {
        switch (action) {
            case Action.AJUDA_EXTERNA: return configs.tiposCartas[card].taxar;
            case Action.TAXAR: return configs.tiposCartas[card].bloquearTaxar;
            case Action.EXTORQUIR: return configs.tiposCartas[card].bloquearExtorquir;
            case Action.ASSASSINAR: return configs.tiposCartas[card].bloquearAssassinar;
            case Action.INVESTIGAR: return configs.tiposCartas[card].bloquearInvestigar;
            case Action.TROCAR: return configs.tiposCartas[card].bloquearTrocar;
            default: throw new Error(`Action ${action} cannot be block`);
        }
    }

    save({
        turn,
        player,
        card,
        selfCard
    }: ValidActionRequest): void {
        const lastAction = turn.getLastAction() as Action;

        const dontNeedAddSelfCardActions = [
            Action.ASSASSINAR,
            Action.INVESTIGAR
        ];

        const needTargetActions = [
            Action.AJUDA_EXTERNA,
            Action.TAXAR,
            Action.TROCAR
        ];

        turn.addAction(Action.BLOQUEAR);

        turn.addCardType(card as CardType);

        if (!dontNeedAddSelfCardActions.includes(lastAction))
            turn.addCard(selfCard as CardSlot);

        if (needTargetActions.includes(lastAction))
            turn.addTarget(player);
    }

    finish(): TurnState {
        return TurnState.TURN_WAITING_REPLY;
    }

    actionInfos({
        player,
        card,
        target
    }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.BLOQUEAR,
            card: card,
            target: (target as Player).name,
            attackedCard: undefined,
            isInvestigating: false,
            winContesting: false
        };
    }
}