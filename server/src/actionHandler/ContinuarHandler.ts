import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, RequestInfos, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import Player, { CardSlot } from "@entitys/player";
import Config from "@utils/Config";
import Turn from "@entitys/Turn";

export default class ContinuarHandler implements ActionHandler {
    private isInvestigating: boolean = false;
    private isLastActionFinisher: boolean = false;

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
        target,
        playerDied
    }: ValidActionRequest) {
        const action = turn.getBlocker() !== undefined ?
            Action.BLOQUEAR
            :
            turn.getLastAction();

        switch (action) {
            case Action.EXTORQUIR: this.saveExtorquir(turn, configs, player, target as Player); break;
            case Action.ASSASSINAR: this.saveAssassinar(turn, player, playerDied); break;
            case Action.INVESTIGAR: this.saveInvestigar(turn, player, target as Player); break;
            case Action.CONTINUAR: this.saveContinuar(); break;
            case Action.BLOQUEAR: this.saveBloquear(turn, configs, player); break;
            default: throw new Error(`Action ${action} cannot be accepted`);
        }

        turn.addAction(Action.CONTINUAR);
    }

    private saveExtorquir(turn: Turn, configs: Config, player: Player, target: Player) {
        const cardType = turn.getFirstCardType() as CardType;

        const extorquirMaxAmount = configs.tiposCartas[cardType].quantidadeExtorquir;

        const actualAmount = Math.min(player.getMoney(), extorquirMaxAmount);

        player.removeMoney(actualAmount);
        target.addMoney(actualAmount);
    }

    private saveAssassinar(turn: Turn, player: Player, playerDied: (name: string) => void) {
        const card = turn.getLastCard() as CardSlot;

        const playerIsDead = player.killCard(card);

        if (playerIsDead)
            playerDied(player.name);
    }

    private saveInvestigar(turn: Turn, player: Player, target: Player) {
        this.isInvestigating = true;

        if (turn.getContester() !== undefined) {
            this.isLastActionFinisher = true;
            turn.setCurrentPlayer(player);
        } else
            turn.setCurrentPlayer(target);
    }

    private saveContinuar() {
        this.isInvestigating = true;
        this.isLastActionFinisher = true;
    }

    private saveBloquear(turn: Turn, configs: Config, player: Player) {
        const action = turn.getFirstAction() as Action;

        switch (action) {
            case Action.AJUDA_EXTERNA: this.saveBloquearAjudaExterna(configs, player); break;
            case Action.TAXAR: this.saveBloquearTaxar(turn, configs, player); break;
            case Action.EXTORQUIR: break;
            case Action.ASSASSINAR: break;
            case Action.INVESTIGAR: this.saveBloquearInvestigar(turn); break;
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

    private saveBloquearInvestigar(turn: Turn) {
        if (turn.getBlockContester() !== undefined) {
            this.isInvestigating = true;
            this.isLastActionFinisher = true;
        }
    }

    private saveBloquearTrocar(player: Player) {
        player.rollbackCards();
    }

    finish(): TurnState {
        return this.isInvestigating && !this.isLastActionFinisher ? 
            TurnState.TURN_WAITING_REPLY
            :
            TurnState.TURN_FINISHED;
    }

    actionInfos({
        player
    }: RequestInfos): ActionInfos {
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