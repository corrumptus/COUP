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
    }: ValidActionRequest): boolean {
        const action = game.getLastTurn().getLastAction();

        switch (action) {
            case Action.EXTORQUIR: return this.saveExtorquir(game, player, target as Player);
            case Action.ASSASSINAR: return this.saveAssassinar(game, target as Player);
            case Action.INVESTIGAR: return this.saveInvestigar();
            case Action.BLOQUEAR: return this.saveBloquear(game, player);
            default: throw new Error(`Action ${action} cannot be accepted`);
        }
    }

    private saveExtorquir(game: Game, player: Player, target: Player) {
        const cardType = game.getLastTurn().getFirstCardType() as CardType;

        const extorquirAmount = game.getConfigs().tiposCartas[cardType].quantidadeExtorquir;

        player.addMoney(extorquirAmount);
        target.removeMoney(extorquirAmount);

        return false;
    }

    private saveAssassinar(game: Game, target: Player) {
        const card = game.getLastTurn().getLastCard() as CardSlot;

        target.killCard(card);

        return false;
    }

    private saveInvestigar() {
        this.isInvestigating = true;

        return true;
    }

    private saveBloquear(game: Game, player: Player) {
        const action = game.getLastTurn().getFirstAction() as Action;

        switch (action) {
            case Action.AJUDA_EXTERNA: return this.saveBloquearAjudaExterna(game, player);
            case Action.TAXAR: return this.saveBloquearTaxar(game, player);
            case Action.EXTORQUIR: return this.saveBloquearExtorquir();
            case Action.ASSASSINAR: return this.saveBloquearAssassinar();
            case Action.INVESTIGAR: return this.saveBloquearInvestigar();
            case Action.TROCAR: return this.saveBloquearTrocar(player);
            default: throw new Error(`Cannot accept blocked action ${action}`);
        }
    }

    private saveBloquearAjudaExterna(game: Game, player: Player) {
        player.removeMoney(game.getConfigs().ajudaExterna);

        return false;
    }
    
    private saveBloquearTaxar(game: Game, player: Player) {
        const cardType = game.getLastTurn().getFirstCardType() as CardType;

        player.removeMoney(game.getConfigs().tiposCartas[cardType].quantidadeTaxar);

        return false;
    }

    private saveBloquearExtorquir() {
        return false;
    }

    private saveBloquearAssassinar() {
        return false;
    }

    private saveBloquearInvestigar() {
        return false;
    }

    private saveBloquearTrocar(player: Player) {
        player.rollbackCards();

        return false;
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