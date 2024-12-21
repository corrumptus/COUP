import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import Player, { CardSlot, isCardSlot } from "@entitys/player";
import Turn from "@entitys/Turn";
import Config from "@utils/Config";

export default class ContestarHandler implements ActionHandler {
    private isInvestigating: boolean = false;
    private winContesting: boolean = false;

    validate({
        turn,
        player,
        selfCard
    }: ActionRequest): void {
        const action = turn.getLastAction();

        if (action === undefined)
            throw new Error("Contestar não pode ser a primeira ação");

        if (action === Action.BLOQUEAR)
            this.validateBloquear(turn, player, selfCard);
        else
            this.validateNonBloquear(player, action, selfCard);
    }

    private validateBloquear(turn: Turn, player: Player, selfCard: number | undefined): void {
        const action = turn.getFirstAction() as Action;

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
        turn,
        configs,
        asylumAPI,
        player,
        target,
        selfCard
    }: ValidActionRequest): void {
        const action = turn.getLastAction();

        turn.addAction(Action.CONTESTAR);

        switch (action) {
            case Action.TAXAR: this.saveTaxar(turn, configs, player, selfCard as CardSlot, target as Player); break;
            case Action.CORRUPCAO: this.saveCorrupcao(turn, configs, asylumAPI.add, player, selfCard as CardSlot, target as Player); break;
            case Action.EXTORQUIR: this.saveExtorquir(turn, configs, player, selfCard as CardSlot, target as Player); break;
            case Action.ASSASSINAR: this.saveAssassinar(turn, configs, player, target as Player); break;
            case Action.INVESTIGAR: this.saveInvestigar(turn, configs, player, target as Player); break;
            case Action.TROCAR: this.saveTrocar(turn, configs, player, selfCard as CardSlot, target as Player); break;
            case Action.BLOQUEAR: this.saveBloquear(turn, configs, player, selfCard as CardSlot, target as Player); break;
            default: throw new Error(`Action ${action} cannot be contested`);
        }
    }

    private saveTaxar(turn: Turn, configs: Config, player: Player, selfCard: CardSlot, target: Player): void {
        const taxarCard = turn.getFirstCard() as CardSlot;

        const taxarCardType = target.getCard(taxarCard).getType();
        
        turn.addTarget(player);

        if (configs.tiposCartas[taxarCardType].taxar)
            player.killCard(selfCard);
        else {
            target.killCard(taxarCard);
            target.rollbackMoney();

            this.winContesting = true;
        }

        turn.addCard(selfCard);
    }

    private saveCorrupcao(
        turn: Turn,
        configs: Config,
        addAsylumCoins: (amount: number) => void,
        player: Player,
        selfCard: CardSlot,
        target: Player
    ): void {
        const corrupcaoCard = turn.getFirstCard() as CardSlot;

        const corrupcaoCardType = target.getCard(corrupcaoCard).getType();
        
        turn.addTarget(player);

        if (configs.religiao.cartasParaCorrupcao[corrupcaoCardType])
            player.killCard(selfCard);
        else {
            target.killCard(corrupcaoCard);
            const asilo = target.rollbackMoney();

            addAsylumCoins(asilo);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
    }

    private saveExtorquir(turn: Turn, configs: Config, player: Player, selfCard: CardSlot, target: Player): void {
        const extorquirCard = turn.getFirstCard() as CardSlot;

        const extorquirCardType = target.getCard(extorquirCard).getType();

        if (configs.tiposCartas[extorquirCardType].extorquir) {
            const extorquirAmount = configs.tiposCartas[extorquirCardType].quantidadeExtorquir;

            player.removeMoney(extorquirAmount);
            target.addMoney(extorquirAmount);

            player.killCard(selfCard);
        } else {
            target.killCard(extorquirCard);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
    }

    private saveAssassinar(turn: Turn, configs: Config, player: Player, target: Player): void {
        const assassinarCard = turn.getFirstCard() as CardSlot;

        const assassinarCardType = target.getCard(assassinarCard).getType();

        if (configs.tiposCartas[assassinarCardType].assassinar) {
            const cardKilledByKiller = turn.getLastCard() as CardSlot;

            const cardKilledByContestar = (cardKilledByKiller+1)%2 as CardSlot;

            player.killCard(cardKilledByKiller);
            player.killCard(cardKilledByContestar);
        } else {
            target.killCard(assassinarCard);

            this.winContesting = true;
        }
    }

    private saveInvestigar(turn: Turn, configs: Config, player: Player, target: Player): void {
        const investigarCard = turn.getFirstCard() as CardSlot;

        const investigarCardType = target.getCard(investigarCard).getType();

        const investigatedCard = turn.getLastCard() as CardSlot;

        if (configs.tiposCartas[investigarCardType].investigar) {
            const cardKilledByContestar = (investigatedCard+1)%2 as CardSlot;

            player.killCard(cardKilledByContestar);

            this.isInvestigating = true;
        } else {
            target.killCard(investigarCard);

            this.winContesting = true;
        }
    }

    private saveTrocar(turn: Turn, configs: Config, player: Player, selfCard: CardSlot, target: Player): void {
        const trocarCard = turn.getFirstCard() as CardSlot;

        const trocarCardType = (target.getPreviousCards() as [CardType, CardType])[0];

        if (configs.tiposCartas[trocarCardType].trocar) {
            player.killCard(selfCard);

            this.winContesting = true;
        } else {
            target.rollbackCards();
            target.killCard(trocarCard);
        }

        turn.addCard(selfCard);
        turn.addTarget(player);
    }

    private saveBloquear(turn: Turn, configs: Config, player: Player, selfCard: CardSlot, target: Player): void {
        const action = turn.getFirstAction();

        switch (action) {
            case Action.AJUDA_EXTERNA: this.saveBloquearAjudaExterna(turn, configs, player, selfCard, target); break;
            case Action.TAXAR: this.saveBloquearTaxar(turn, configs, player, target); break;
            case Action.EXTORQUIR: this.saveBloquearExtorquir(turn, configs, player, target); break;
            case Action.ASSASSINAR: this.saveBloquearAssassinar(turn, configs, player, target); break;
            case Action.INVESTIGAR: this.saveBloquearInvestigar(turn, configs, player, target); break;
            case Action.TROCAR: this.saveBloquearTrocar(turn, configs, player, target); break;
            default: throw new Error(`Cannot contest the blocked action ${action}`);
        }
    }

    private saveBloquearAjudaExterna(turn: Turn, configs: Config, player: Player, selfCard: CardSlot, target: Player): void {
        const bloquearCard = turn.getFirstCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].taxar) {
            player.rollbackMoney();
            player.killCard(selfCard);
        } else {
            target.killCard(bloquearCard);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
    }

    private saveBloquearTaxar(turn: Turn, configs: Config, player: Player, target: Player): void {
        const taxarCard = turn.getFirstCard() as CardSlot;

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearTaxar) {
            player.rollbackMoney();
            player.killCard(taxarCard);
        } else {
            target.killCard(bloquearCard);

            this.winContesting = true;
        }
    }

    private saveBloquearExtorquir(turn: Turn, configs: Config, player: Player, target: Player): void {
        const extorquirCard = turn.getFirstCard() as CardSlot;

        const extorquirCardType = player.getCard(extorquirCard).getType();

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearExtorquir)
            player.killCard(extorquirCard);
        else {
            const extorquirAmount = configs.tiposCartas[extorquirCardType].quantidadeExtorquir;

            target.removeMoney(extorquirAmount);
            player.addMoney(extorquirAmount);

            target.killCard(bloquearCard);

            this.winContesting = true;
        }
    }

    private saveBloquearAssassinar(turn: Turn, configs: Config, player: Player, target: Player): void {
        const assassinarCard = turn.getFirstCard() as CardSlot;

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearAssassinar)
            player.killCard(assassinarCard);
        else {
            const cardKilledByContestar = (bloquearCard+1)%2 as CardSlot;

            target.killCard(bloquearCard);
            target.killCard(cardKilledByContestar);

            this.winContesting = true;
        }
    }

    private saveBloquearInvestigar(turn: Turn, configs: Config, player: Player, target: Player): void {
        const investigarCard = turn.getFirstCard() as CardSlot;

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearInvestigar)
            player.killCard(investigarCard);
        else {
            const cardKilledByContestar = (bloquearCard+1)%2 as CardSlot;

            target.killCard(cardKilledByContestar);

            this.isInvestigating = true;

            this.winContesting = true;
        }
    }

    private saveBloquearTrocar(turn: Turn, configs: Config, player: Player, target: Player): void {
        const trocarCard = turn.getFirstCard() as CardSlot;

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearTrocar) {
            player.rollbackCards();
            player.killCard(trocarCard);
        } else {
            target.killCard(bloquearCard);

            this.winContesting = true;
        }
    }

    finish(): TurnState {
        return this.isInvestigating ?
            TurnState.TURN_WAITING_REPLY
            :
            TurnState.TURN_FINISHED;
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
            isInvestigating: this.isInvestigating,
            winContesting: this.winContesting
        };
    }
}