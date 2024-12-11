import { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import Game from "@entitys/Game";
import Player, { CardSlot, isCardSlot } from "@entitys/player";

export default class ContestarHandler implements ActionHandler {
    private isInvestigating: boolean = false;

    validate({
        game,
        player,
        selfCard
    }: ActionRequest): void {
        const action = game.getLastTurn().getLastAction();

        if (action === undefined)
            throw new Error("Contestar não pode ser a primeira ação");

        if (action === Action.BLOQUEAR)
            this.validateBloquear(game, player, selfCard);
        else
            this.validateNonBloquear(player, action, selfCard);
    }

    private validateBloquear(game: Game, player: Player, selfCard: number | undefined): void {
        const action = game.getLastTurn().getFirstAction() as Action;

        if (this.contestarBloquearNeedSelfCard(action))
            this.validateSelfCard(player, selfCard);
    }

    private contestarBloquearNeedSelfCard(action: Action): boolean {
        return action === Action.AJUDA_EXTERNA;
    }

    private validateNonBloquear(player: Player, action: Action, selfCard: number | undefined): void {
        if (this.contestarNonBloquearDontNeedSelfCard(action))
            return;

        this.validateSelfCard(player, selfCard);
    }

    private contestarNonBloquearDontNeedSelfCard(action: Action): boolean {
        return [Action.ASSASSINAR, Action.INVESTIGAR].includes(action);
    }

    private validateSelfCard(player: Player, selfCard: number | undefined): void {
        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");
    }

    save({
        game,
        player,
        target,
        selfCard
    }: ValidActionRequest): void {
        const action = game.getLastTurn().getLastAction();

        game.getLastTurn().addAction(Action.CONTESTAR);

        switch (action) {
            case Action.TAXAR: this.saveTaxar(game, player, selfCard as CardSlot, target as Player); break;
            case Action.CORRUPCAO: this.saveCorrupcao(game, player, selfCard as CardSlot, target as Player); break;
            case Action.EXTORQUIR: this.saveExtorquir(game, player, selfCard as CardSlot, target as Player); break;
            case Action.ASSASSINAR: this.saveAssassinar(game, player, target as Player); break;
            case Action.INVESTIGAR: this.saveInvestigar(game, player, target as Player); break;
            case Action.TROCAR: this.saveTrocar(game, player, selfCard as CardSlot, target as Player); break;
            case Action.BLOQUEAR: this.saveBloquear(game, player, selfCard as CardSlot, target as Player); break;
            default: throw new Error(`Action ${action} cannot be contested`);
        }
    }

    private saveTaxar(game: Game, player: Player, selfCard: CardSlot, target: Player): void {
        const taxarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const taxarCardType = target.getCard(taxarCard).getType();
        
        game.getLastTurn().addTarget(player);

        if (game.getConfigs().tiposCartas[taxarCardType].taxar)
            player.killCard(selfCard);
        else {
            target.killCard(taxarCard);
            target.rollbackMoney();
        }

        game.getLastTurn().addCard(selfCard);
    }

    private saveCorrupcao(game: Game, player: Player, selfCard: CardSlot, target: Player): void {
        const corrupcaoCard = game.getLastTurn().getFirstCard() as CardSlot;

        const corrupcaoCardType = target.getCard(corrupcaoCard).getType();
        
        game.getLastTurn().addTarget(player);

        if (game.getConfigs().religiao.cartasParaCorrupcao[corrupcaoCardType])
            player.killCard(selfCard);
        else {
            target.killCard(corrupcaoCard);
            const asilo = target.rollbackMoney();

            game.addAsylumCoins(asilo);
        }

        game.getLastTurn().addCard(selfCard);
    }

    private saveExtorquir(game: Game, player: Player, selfCard: CardSlot, target: Player): void {
        const extorquirCard = game.getLastTurn().getFirstCard() as CardSlot;

        const extorquirCardType = target.getCard(extorquirCard).getType();

        if (game.getConfigs().tiposCartas[extorquirCardType].extorquir) {
            const extorquirAmount = game.getConfigs().tiposCartas[extorquirCardType].quantidadeExtorquir;

            player.removeMoney(extorquirAmount);
            target.addMoney(extorquirAmount);

            player.killCard(selfCard);
        } else
            target.killCard(extorquirCard);

        game.getLastTurn().addCard(selfCard);
    }

    private saveAssassinar(game: Game, player: Player, target: Player): void {
        const assassinarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const assassinarCardType = target.getCard(assassinarCard).getType();

        if (game.getConfigs().tiposCartas[assassinarCardType].assassinar) {
            const cardKilledByKiller = game.getLastTurn().getLastCard() as CardSlot;

            const cardKilledByContestar = (cardKilledByKiller+1)%2 as CardSlot;

            player.killCard(cardKilledByKiller);
            player.killCard(cardKilledByContestar);
        } else
            target.killCard(assassinarCard);
    }

    private saveInvestigar(game: Game, player: Player, target: Player): void {
        const investigarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const investigarCardType = player.getCard(investigarCard).getType();

        if (!game.getConfigs().tiposCartas[investigarCardType].investigar) {
            player.killCard(investigarCard);

            return;
        }

        const investigatedCard = game.getLastTurn().getLastCard() as CardSlot;

        const cardKilledByContestar = (investigatedCard+1)%2 as CardSlot;

        target.killCard(cardKilledByContestar);
    }

    private saveTrocar(game: Game, player: Player, selfCard: CardSlot, target: Player): void {
        const trocarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const trocarCardType = player.getCard(trocarCard).getType();

        if (game.getConfigs().tiposCartas[trocarCardType].trocar)
            target.killCard(selfCard);
        else {
            player.rollbackCards();
            player.killCard(trocarCard);
        }

        game.getLastTurn().addCard(selfCard);
    }

    private saveBloquear(game: Game, player: Player, selfCard: CardSlot, target: Player): void {
        const action = game.getLastTurn().getFirstAction();

        switch (action) {
            case Action.AJUDA_EXTERNA: this.saveBloquearAjudaExterna(game, player, selfCard, target); break;
            case Action.TAXAR: this.saveBloquearTaxar(game, player, target); break;
            case Action.EXTORQUIR: this.saveBloquearExtorquir(game, player, target); break;
            case Action.ASSASSINAR: this.saveBloquearAssassinar(game, player, target); break;
            case Action.INVESTIGAR: this.saveBloquearInvestigar(game, player, target); break;
            case Action.TROCAR: this.saveBloquearTrocar(game, player, target); break;
            default: throw new Error(`Cannot contest the blocked action ${action}`);
        }
    }

    private saveBloquearAjudaExterna(game: Game, player: Player, selfCard: CardSlot, target: Player): void {
        const bloquearCard = game.getLastTurn().getFirstCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (game.getConfigs().tiposCartas[bloquearCardType].taxar) {
            player.rollbackMoney();
            player.killCard(selfCard);
        } else
            target.killCard(bloquearCard);

        game.getLastTurn().addCard(selfCard);
    }

    private saveBloquearTaxar(game: Game, player: Player, target: Player): void {
        const taxarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const bloquearCard = game.getLastTurn().getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (game.getConfigs().tiposCartas[bloquearCardType].bloquearTaxar) {
            player.rollbackMoney();
            player.killCard(taxarCard);
        } else
            target.killCard(bloquearCard);
    }

    private saveBloquearExtorquir(game: Game, player: Player, target: Player): void {
        const extorquirCard = game.getLastTurn().getFirstCard() as CardSlot;

        const extorquirCardType = player.getCard(extorquirCard).getType();

        const bloquearCard = game.getLastTurn().getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (game.getConfigs().tiposCartas[bloquearCardType].bloquearExtorquir)
            player.killCard(extorquirCard);
        else {
            const extorquirAmount = game.getConfigs().tiposCartas[extorquirCardType].quantidadeExtorquir;

            target.removeMoney(extorquirAmount);
            player.addMoney(extorquirAmount);

            target.killCard(bloquearCard);
        }
    }

    private saveBloquearAssassinar(game: Game, player: Player, target: Player): void {
        const assassinarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const bloquearCard = game.getLastTurn().getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (game.getConfigs().tiposCartas[bloquearCardType].bloquearAssassinar)
            player.killCard(assassinarCard);
        else {
            const cardKilledByContestar = (bloquearCard+1)%2 as CardSlot;

            target.killCard(bloquearCard);
            target.killCard(cardKilledByContestar);
        }
    }

    private saveBloquearInvestigar(game: Game, player: Player, target: Player): void {
        const investigarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const bloquearCard = game.getLastTurn().getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (game.getConfigs().tiposCartas[bloquearCardType].bloquearInvestigar)
            player.killCard(investigarCard);
        else {
            const cardKilledByContestar = (bloquearCard+1)%2 as CardSlot;

            target.killCard(cardKilledByContestar);
        }
    }

    private saveBloquearTrocar(game: Game, player: Player, target: Player): void {
        const trocarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const bloquearCard = game.getLastTurn().getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (game.getConfigs().tiposCartas[bloquearCardType].bloquearInvestigar) {
            player.rollbackCards();
            player.killCard(trocarCard);
        } else
            target.killCard(bloquearCard);
    }

    finish(game: Game): boolean {
        if (this.isInvestigating)
            return false;

        game.getLastTurn().finish();

        return false;
    }

    actionInfos({
        player,
        target
    }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.CONTESTAR,
            card: undefined,
            target: target?.name,
            attackedCard: undefined,
            isInvestigating: this.isInvestigating
        };
    }
}