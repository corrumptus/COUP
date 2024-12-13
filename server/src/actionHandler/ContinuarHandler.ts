import { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import CardType from "@entitys/CardType";
import Game from "@entitys/Game";
import Player, { CardSlot } from "@entitys/player";

export default class ContinuarHandler implements ActionHandler {
    private isInvestigating: boolean = false;

    validate({
        game
    }: ActionRequest): void {
        const turn = game.getLastTurn();

        if (
            [Action.CONTINUAR, Action.CONTESTAR].includes(turn.getLastAction() as Action)
            &&
            turn.getFirstAction() !== Action.INVESTIGAR
        )
            throw new Error(`Action ${turn.getLastAction()} cannot be accepted`);
    }

    save({
        game,
        player,
        target
    }: ValidActionRequest) {
        const action = game.getLastTurn().getLastAction();

        game.getLastTurn().addAction(Action.CONTINUAR);

        switch (action) {
            case Action.EXTORQUIR: this.saveExtorquir(game, player, target as Player); break;
            case Action.ASSASSINAR: this.saveAssassinar(game, player); break;
            case Action.INVESTIGAR: this.saveInvestigar(); break;
            case Action.CONTINUAR: this.saveContinuar(); break;
            case Action.BLOQUEAR: this.saveBloquear(game, player); break;
            case Action.CONTESTAR: this.saveContestar(); break;
            default: throw new Error(`Action ${action} cannot be accepted`);
        }
    }

    private saveExtorquir(game: Game, player: Player, target: Player) {
        const cardType = game.getLastTurn().getFirstCardType() as CardType;

        const extorquirAmount = game.getConfigs().tiposCartas[cardType].quantidadeExtorquir;

        player.removeMoney(extorquirAmount);
        target.addMoney(extorquirAmount);
    }

    private saveAssassinar(game: Game, player: Player) {
        const card = game.getLastTurn().getLastCard() as CardSlot;

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

    private saveBloquear(game: Game, player: Player) {
        const action = game.getLastTurn().getFirstAction() as Action;

        switch (action) {
            case Action.AJUDA_EXTERNA: this.saveBloquearAjudaExterna(game, player); break;
            case Action.TAXAR: this.saveBloquearTaxar(game, player); break;
            case Action.EXTORQUIR: this.saveBloquearExtorquir(); break;
            case Action.ASSASSINAR: this.saveBloquearAssassinar(); break;
            case Action.INVESTIGAR: this.saveBloquearInvestigar(); break;
            case Action.TROCAR: this.saveBloquearTrocar(player); break;
            default: throw new Error(`Cannot accept blocked action ${action}`);
        }
    }

    private saveBloquearAjudaExterna(game: Game, player: Player) {
        player.removeMoney(game.getConfigs().ajudaExterna);
    }
    
    private saveBloquearTaxar(game: Game, player: Player) {
        const cardType = game.getLastTurn().getFirstCardType() as CardType;

        player.removeMoney(game.getConfigs().tiposCartas[cardType].quantidadeTaxar);
    }

    private saveBloquearExtorquir() {}

    private saveBloquearAssassinar() {}

    private saveBloquearInvestigar() {}

    private saveBloquearTrocar(player: Player) {
        player.rollbackCards();
    }

    finish(game: Game): boolean {
        if (this.isInvestigating)
            return false;

        game.getLastTurn().finish();

        return false;
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
            isInvestigating: this.isInvestigating
        };
    }
}