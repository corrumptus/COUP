import Action from "../entity/Action";
import Game from "../entity/Game";
import Player, { CardSlot, isCardSlot } from "../entity/player";
import { ActionInfos } from "../service/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "./ActionHandler";

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

    private validateBloquear(game: Game, player: Player, selfCard: number | undefined) {
        const action = game.getLastTurn().getFirstAction() as Action;

        if (this.contestarBloquearDontNeedSelfCard(action))
            return;

        this.validateSelfCard(player, selfCard);
    }

    private contestarBloquearDontNeedSelfCard(action: Action) {
        return [Action.AJUDA_EXTERNA, Action.TAXAR].includes(action);
    }

    private validateNonBloquear(player: Player, action: Action, selfCard: number | undefined) {
        if (this.contestarNonBloquearDontNeedSelfCard(action))
            return;

        this.validateSelfCard(player, selfCard);
    }

    private contestarNonBloquearDontNeedSelfCard(action: Action) {
        return [Action.ASSASSINAR, Action.INVESTIGAR].includes(action);
    }

    private validateSelfCard(player: Player, selfCard: number | undefined) {
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
    }: ValidActionRequest): boolean {
        const action = game.getLastTurn().getLastAction();

        game.getLastTurn().addAction(Action.CONTESTAR);

        switch (action) {
            case Action.TAXAR: return this.saveTaxar(game, player, selfCard as CardSlot, target as Player);
            case Action.CORRUPCAO: return this.saveCorrupcao(game, player, selfCard as CardSlot, target as Player);
            case Action.EXTORQUIR: return this.saveExtorquir(game, player, selfCard as CardSlot, target as Player);
            case Action.ASSASSINAR: return this.saveAssassinar(game, player, target as Player);
            case Action.INVESTIGAR: return this.saveInvestigar(game, player, target as Player);
            case Action.TROCAR: return this.saveTrocar(game, player, selfCard as CardSlot, target as Player);
            case Action.BLOQUEAR: return this.saveBloquear(game, player, selfCard as CardSlot, target as Player);
            default: throw new Error(`Action ${action} cannot be contested`);
        }
    }

    private saveTaxar(game: Game, player: Player, selfCard: CardSlot, target: Player) {
        const taxarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const taxarCardType = player.getCard(taxarCard).getType();

        if (game.getConfigs().tiposCartas[taxarCardType].taxar)
            target.killCard(selfCard);
        else {
            player.killCard(taxarCard);
            player.rollbackMoney();
        }

        game.getLastTurn().addCard(selfCard);

        return false;
    }

    private saveCorrupcao(game: Game, player: Player, selfCard: CardSlot, target: Player) {
        const corrupcaoCard = game.getLastTurn().getFirstCard() as CardSlot;

        const corrupcaoCardType = player.getCard(corrupcaoCard).getType();

        if (game.getConfigs().religiao.cartasParaCorrupcao[corrupcaoCardType])
            target.killCard(selfCard);
        else {
            player.killCard(corrupcaoCard);
            player.rollbackMoney();
        }

        game.getLastTurn().addCard(selfCard);

        return false;
    }

    private saveExtorquir(game: Game, player: Player, selfCard: CardSlot, target: Player) {
        const extorquirCard = game.getLastTurn().getFirstCard() as CardSlot;

        const extorquirCardType = player.getCard(extorquirCard).getType();

        if (game.getConfigs().tiposCartas[extorquirCardType].extorquir) {
            const extorquirAmount = game.getConfigs().tiposCartas[extorquirCardType].quantidadeExtorquir;

            target.removeMoney(extorquirAmount);
            player.addMoney(extorquirAmount);

            target.killCard(selfCard);
        } else
            player.killCard(extorquirCard);

        game.getLastTurn().addCard(selfCard);

        return false;
    }

    private saveAssassinar(game: Game, player: Player, target: Player) {
        const assassinarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const assassinarCardType = player.getCard(assassinarCard).getType();

        if (game.getConfigs().tiposCartas[assassinarCardType].assassinar) {
            const cardKilledByKiller = game.getLastTurn().getLastCard() as CardSlot;

            const cardKilledByContestar = (cardKilledByKiller+1)%2 as CardSlot;

            target.killCard(cardKilledByKiller);
            target.killCard(cardKilledByContestar);
        } else
            player.killCard(assassinarCard);

        return false;
    }

    private saveInvestigar(game: Game, player: Player, target: Player) {
        const investigarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const investigarCardType = player.getCard(investigarCard).getType();

        if (game.getConfigs().tiposCartas[investigarCardType].investigar) {
            const investigatedCard = game.getLastTurn().getLastCard() as CardSlot;

            const cardKilledByContestar = (investigatedCard+1)%2 as CardSlot;

            target.killCard(cardKilledByContestar);

            this.isInvestigating = true;

            return true;
        }
        
        player.killCard(investigarCard);

        return false;
    }

    private saveTrocar(game: Game, player: Player, selfCard: CardSlot, target: Player) {
        const trocarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const trocarCardType = player.getCard(trocarCard).getType();

        if (game.getConfigs().tiposCartas[trocarCardType].trocar)
            target.killCard(selfCard);
        else {
            player.rollbackCards();
            player.killCard(trocarCard);
        }

        game.getLastTurn().addCard(selfCard);

        return false;
    }

    private saveBloquear(game: Game, player: Player, selfCard: CardSlot, target: Player) {
        const action = game.getLastTurn().getFirstAction();

        switch (action) {
            case Action.AJUDA_EXTERNA: return this.saveBloquearAjudaExterna(
                game,
                player,
                selfCard,
                target
            );
            case Action.TAXAR: return this.saveBloquearTaxar(game, player, target);
            case Action.EXTORQUIR: return this.saveBloquearExtorquir(game, player, target);
            case Action.ASSASSINAR: return this.saveBloquearAssassinar(game, player, target);
            case Action.INVESTIGAR: return this.saveBloquearInvestigar(game, player, target);
            case Action.TROCAR: return this.saveBloquearTrocar(game, player, target);
            default: throw new Error(`Cannot contest the blocked action ${action}`);
        }
    }

    private saveBloquearAjudaExterna(game: Game, player: Player, selfCard: CardSlot, target: Player) {
        const bloquearCard = game.getLastTurn().getFirstCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (game.getConfigs().tiposCartas[bloquearCardType].taxar) {
            player.rollbackMoney();
            player.killCard(selfCard);
        } else
            target.killCard(bloquearCard);

        game.getLastTurn().addCard(selfCard);

        return false;
    }

    private saveBloquearTaxar(game: Game, player: Player, target: Player) {
        const taxarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const bloquearCard = game.getLastTurn().getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (game.getConfigs().tiposCartas[bloquearCardType].bloquearTaxar) {
            player.rollbackMoney();
            player.killCard(taxarCard);
        } else
            target.killCard(bloquearCard);

        return false;
    }

    private saveBloquearExtorquir(game: Game, player: Player, target: Player) {
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

        return false;
    }

    private saveBloquearAssassinar(game: Game, player: Player, target: Player) {
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

        return false;
    }

    private saveBloquearInvestigar(game: Game, player: Player, target: Player) {
        const investigarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const bloquearCard = game.getLastTurn().getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (game.getConfigs().tiposCartas[bloquearCardType].bloquearInvestigar)
            player.killCard(investigarCard);
        else {
            const cardKilledByContestar = (bloquearCard+1)%2 as CardSlot;

            target.killCard(cardKilledByContestar);
        }

        return false;
    }

    private saveBloquearTrocar(game: Game, player: Player, target: Player) {
        const trocarCard = game.getLastTurn().getFirstCard() as CardSlot;

        const bloquearCard = game.getLastTurn().getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (game.getConfigs().tiposCartas[bloquearCardType].bloquearInvestigar) {
            player.rollbackCards();
            player.killCard(trocarCard);
        } else
            target.killCard(bloquearCard);

        return false;
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