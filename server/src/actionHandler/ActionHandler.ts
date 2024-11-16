import CardType from "../entity/CardType"
import Game from "../entity/Game"
import Player, { CardSlot } from "../entity/player"
import { ActionInfos } from "../service/GameMessageService"

export type ActionRequest = {
    game: Game,
    player: Player,
    card?: CardType,
    selfCard?: number,
    target?: Player,
    targetCard?: number
}

export type ValidActionRequest = {
    game: Game,
    player: Player,
    card?: CardType,
    selfCard?: CardSlot,
    target?: Player,
    targetCard?: CardSlot
}

export default abstract class ActionHandler {
    abstract validate(request: ActionRequest): void;
    abstract save(request: ValidActionRequest): boolean;
    abstract finish(lobbyId: number, game: Game): void;
    abstract actionInfos(game: Game, card: CardType | undefined, targetCard: CardSlot | undefined): ActionInfos;
}