import Action from "../entity/Action";
import Game from "../entity/Game";
import { ActionInfos } from "../service/GameMessageService";
import ActionHandler, { ValidActionRequest } from "./ActionHandler";

export default class AjudaExternaHandler implements ActionHandler {
    validate(): void {}

    save({ game, player }: ValidActionRequest): void {
        player.addMoney(game.getConfigs().ajudaExterna);

        game.getLastTurn().addAction(Action.AJUDA_EXTERNA);
    }

    finish(game: Game): boolean {
        game.nextPlayer();

        return true;
    }

    actionInfos({ player }: ValidActionRequest): ActionInfos {
        return {
            attacker: player.name,
            action: Action.AJUDA_EXTERNA,
            card: undefined,
            target: undefined,
            attackedCard: undefined,
            isInvestigating: false
        };
    }
}