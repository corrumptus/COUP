import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Player, { CardSlot, isCardSlot } from "../entity/player";
import { ActionInfos } from "../service/GameMessageService";
import Config from "../utils/Config";
import ActionHandler, { ActionRequest, ValidActionRequest } from "./ActionHandler";

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
            this.validateActionsDontNeedSelfCard(game, action);
        else
            this.validateActionsNeedSelfCard(game, player, action, card, selfCard);
    }

    private dontNeedSelfCard(action: Action) {
        return [Action.AJUDA_EXTERNA, Action.INVESTIGAR].includes(action);
    }

    private validateActionsDontNeedSelfCard(game: Game, action: Action) {
        if (!this.canBlock(
            action,
            game.getLastTurn().getFirstCardType() as CardType,
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
    ) {
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

    private canBlock(action: Action, card: CardType, configs: Config) {
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
        card,
        selfCard,
        target
    }: ValidActionRequest): boolean {
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

        if (dontNeedAddSelfCardActions.includes(lastAction))
            return false;

        game.getLastTurn().addCardType(card as CardType);
        game.getLastTurn().addCard(selfCard as CardSlot);

        if (needTargetActions.includes(lastAction))
            game.getLastTurn().addTarget(target as Player);

        return false;
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
            target: target?.name,
            attackedCard: undefined,
            isInvestigating: false
        };
    }
}