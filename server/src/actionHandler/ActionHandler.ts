import type { ActionInfos } from "@services/GameMessageService";
import type CardType from "@entitys/CardType";
import type Game from "@entitys/Game";
import type Player from "@entitys/player";
import type { CardSlot } from "@entitys/player";

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
    abstract save(request: ValidActionRequest): void;
    /**
     * @returns {boolean} return if the action needs to wait another player to act
     */
    abstract finish(game: Game): boolean;
    abstract actionInfos(request: ValidActionRequest): ActionInfos;
}