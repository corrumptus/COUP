import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Player, { CardSlot } from "../entity/player";
import { ActionInfos } from "../service/GameMessageService";
import ActionHandler, { ValidActionRequest } from "./ActionHandler";

export default class ContinuarHandler implements ActionHandler {
    private isInvestigating: boolean = false;

    validate(): void {}

    save({
        game,
        player,
        target
    }: ValidActionRequest) {
        const action = game.getLastTurn().getLastAction();

        game.getLastTurn().addAction(Action.CONTINUAR);

        switch (action) {
            case Action.EXTORQUIR: this.saveExtorquir(game, player, target as Player); break;
            case Action.ASSASSINAR: this.saveAssassinar(game, target as Player); break;
            case Action.INVESTIGAR: this.saveInvestigar(); break;
            case Action.BLOQUEAR: this.saveBloquear(game, player); break;
            default: throw new Error(`Action ${action} cannot be accepted`);
        }
    }

    private saveExtorquir(game: Game, player: Player, target: Player) {
        const cardType = game.getLastTurn().getFirstCardType() as CardType;

        const extorquirAmount = game.getConfigs().tiposCartas[cardType].quantidadeExtorquir;

        player.addMoney(extorquirAmount);
        target.removeMoney(extorquirAmount);
    }

    private saveAssassinar(game: Game, target: Player) {
        const card = game.getLastTurn().getLastCard() as CardSlot;

        target.killCard(card);
    }

    private saveInvestigar() {
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