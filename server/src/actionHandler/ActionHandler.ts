import type { ActionInfos } from "@services/GameMessageService";
import type CardType from "@entitys/CardType";
import type Player from "@entitys/player";
import type { CardSlot } from "@entitys/player";
import Config from "@utils/Config";
import Turn from "@entitys/Turn";

export type ActionRequest = {
    turn: Turn,
    configs: Config,
    asylumCoins: number,
    player: Player,
    card?: CardType,
    selfCard?: number,
    target?: Player,
    targetCard?: number,
    globalThirdPerson?: Player
}

export type ValidActionRequest = {
    turn: Turn,
    configs: Config,
    asylumAPI: {
        get: () => number,
        reset: () => void,
        add: (amount: number) => void
    },
    player: Player,
    card?: CardType,
    selfCard?: CardSlot,
    target?: Player,
    targetCard?: CardSlot,
    globalThirdPerson?: Player
}

export enum TurnState {
    TURN_FINISHED,
    TURN_WAITING_REPLY,
    TURN_WAITING_TIMEOUT
}

export default abstract class ActionHandler {
    abstract validate(request: ActionRequest): void;
    abstract save(request: ValidActionRequest): void;
    abstract finish(): TurnState;
    abstract actionInfos(request: ValidActionRequest): ActionInfos;
}