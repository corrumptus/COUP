import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import type Game from "@entitys/Game";
import Player, { CardSlot, isCardSlot } from "@entitys/player";
import type Config from "@utils/Config";

export default class BloquearHandler implements ActionHandler {
    validate({
        game,
        player,
        card,
        selfCard
    }: ActionRequest): void {
        const action = game.getLastTurn().getFirstAction();

        if (action === undefined)
            throw new Error("Bloquear não pode ser a primeira ação");

        if (this.dontNeedSelfCard(action))
            this.validateActionsDontNeedSelfCard(game, action, card);
        else
            this.validateActionsNeedSelfCard(game, player, action, card, selfCard);
    }

    private dontNeedSelfCard(action: Action): boolean {
        return [Action.ASSASSINAR, Action.INVESTIGAR].includes(action);
    }

    private validateActionsDontNeedSelfCard(
        game: Game,
        action: Action,
        card: CardType | undefined
    ): void {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (!this.canBlock(
            action,
            card,
            game.getConfigs()
        ))
            throw new Error("O tipo de carta escolhida não pode bloquear está ação");
    }

    private validateActionsNeedSelfCard(
        game: Game,
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

        if (!this.canBlock(action, card, game.getConfigs()))
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
        game,
        player,
        card,
        selfCard
    }: ValidActionRequest): void {
        const lastAction = game.getLastTurn().getLastAction() as Action;

        const dontNeedAddSelfCardActions = [
            Action.ASSASSINAR,
            Action.INVESTIGAR
        ];

        const needTargetActions = [
            Action.AJUDA_EXTERNA,
            Action.TAXAR,
            Action.TROCAR
        ];

        game.getLastTurn().addAction(Action.BLOQUEAR);

        game.getLastTurn().addCardType(card as CardType);

        if (!dontNeedAddSelfCardActions.includes(lastAction))
            game.getLastTurn().addCard(selfCard as CardSlot);

        if (needTargetActions.includes(lastAction))
            game.getLastTurn().addTarget(player);
    }

    finish(): boolean {
        return true;
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