import CardType from "../entity/CardType";
import Game from "../entity/Game";
import { CardSlot } from "../entity/player";
import { ActionInfos } from "../service/GameMessageService";
import ActionHandler, { ActionRequest, ValidActionRequest } from "./ActionHandler";

export default class BloquearHandler implements ActionHandler {
    validate(request: ActionRequest): void {
        throw new Error("Method not implemented.");
    }

    save(request: ValidActionRequest): boolean {
        throw new Error("Method not implemented.");
    }

    finish(lobbyId: number, game: Game): void {
        throw new Error("Method not implemented.");
    }

    actionInfos(game: Game, card: CardType | undefined, targetCard: CardSlot | undefined): ActionInfos {
        throw new Error("Method not implemented.");
    }
}