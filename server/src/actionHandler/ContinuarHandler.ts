import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import Player, { CardSlot } from "@entitys/player";
import Config from "@utils/Config";
import Turn from "@entitys/Turn";

export default class ContinuarHandler implements ActionHandler {
    private isInvestigating: boolean = false;

    validate({
        turn
    }: ActionRequest): void {
        if (
            [Action.CONTINUAR, Action.CONTESTAR].includes(turn.getLastAction() as Action)
            &&
            turn.getFirstAction() !== Action.INVESTIGAR
        )
            throw new Error(`Action ${turn.getLastAction()} cannot be accepted`);
    }

    save({
        turn,
        configs,
        player,
        target
    }: ValidActionRequest) {
        const action = turn.getLastAction();

        switch (action) {
            case Action.EXTORQUIR: this.saveExtorquir(turn, configs, player, target as Player); break;
            case Action.ASSASSINAR: this.saveAssassinar(turn, player); break;
            case Action.INVESTIGAR: this.saveInvestigar(); break;
            case Action.CONTINUAR: this.saveContinuar(); break;
            case Action.BLOQUEAR: this.saveBloquear(turn, configs, player); break;
            case Action.CONTESTAR: this.saveContestar(); break;
            default: throw new Error(`Action ${action} cannot be accepted`);
        }

        turn.addAction(Action.CONTINUAR);
    }

    private saveExtorquir(turn: Turn, configs: Config, player: Player, target: Player) {
        const cardType = turn.getFirstCardType() as CardType;

        const extorquirAmount = configs.tiposCartas[cardType].quantidadeExtorquir;

        player.removeMoney(extorquirAmount);
        target.addMoney(extorquirAmount);
    }

    private saveAssassinar(turn: Turn, player: Player) {
        const card = turn.getLastCard() as CardSlot;

        player.killCard(card);
    }

    private saveInvestigar() {
        this.isInvestigating = true;
    }

    private saveContinuar() {
        this.isInvestigating = true;
    }

    private saveContestar() {
        this.isInvestigating = true;
    }

    private saveBloquear(turn: Turn, configs: Config, player: Player) {
        const action = turn.getFirstAction() as Action;

        switch (action) {
            case Action.AJUDA_EXTERNA: this.saveBloquearAjudaExterna(configs, player); break;
            case Action.TAXAR: this.saveBloquearTaxar(turn, configs, player); break;
            case Action.EXTORQUIR: this.saveBloquearExtorquir(); break;
            case Action.ASSASSINAR: this.saveBloquearAssassinar(); break;
            case Action.INVESTIGAR: this.saveBloquearInvestigar(); break;
            case Action.TROCAR: this.saveBloquearTrocar(player); break;
            default: throw new Error(`Cannot accept blocked action ${action}`);
        }
    }

    private saveBloquearAjudaExterna(configs: Config, player: Player) {
        player.removeMoney(configs.ajudaExterna);
    }
    
    private saveBloquearTaxar(turn: Turn, configs: Config, player: Player) {
        const cardType = turn.getFirstCardType() as CardType;

        player.removeMoney(configs.tiposCartas[cardType].quantidadeTaxar);
    }

    private saveBloquearExtorquir() {}

    private saveBloquearAssassinar() {}

    private saveBloquearInvestigar() {}

    private saveBloquearTrocar(player: Player) {
        player.rollbackCards();
    }

    finish(): TurnState {
        return this.isInvestigating ? 
            TurnState.TURN_WAITING_REPLY
            :
            TurnState.TURN_FINISHED;
    }

    actionInfos({
        player
    }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.CONTINUAR,
            card: undefined,
            target: undefined,
            attackedCard: undefined,
            isInvestigating: this.isInvestigating,
            winContesting: false
        };
    }
}