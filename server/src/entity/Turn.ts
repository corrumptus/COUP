import type Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import type Player from "@entitys/player";
import type { CardSlot } from "@entitys/player";

export enum CurrentPlayerType {
    ONLY_PLAYER,
    ONLY_TARGET,
    NON_PLAYER,
    NON_TARGET
}

export default class Turn {
    private player: Player;
    private target: Player | undefined;
    private actionHistory: {
        action: Action,
        cardType?: CardType,
        card?: CardSlot,
        targetCard?: CardSlot
    }[];
    private currentPlayerType: CurrentPlayerType;
    private finished: boolean;

    constructor(player: Player) {
        this.player = player;
        this.target = undefined;
        this.actionHistory = [];
        this.finished = false;
        this.currentPlayerType = CurrentPlayerType.ONLY_PLAYER;
    }

    addAction(
        action: Action,
        cardType?: CardType,
        card?: CardSlot,
        target?: Player,
        targetCard?: CardSlot
    ) {
        if (this.target === undefined)
            this.target = target;

        this.actionHistory.push({
            action: action,
            cardType: cardType,
            card: card,
            targetCard: targetCard
        });
    }

    finish() {
        this.finished = true;
    }

    getPlayer(): Player {
        return this.player;
    }

    getTarget(): Player | undefined {
        return this.target;
    }

    getCurrentPlayerType(): CurrentPlayerType {
        return this.currentPlayerType;
    }

    setCurrentPlayer(playerType: CurrentPlayerType) {
        this.currentPlayerType = playerType;
    }

    get hasBeenStarted(): boolean {
        return this.actionHistory.length < 0;
    }

    get isfinished(): boolean {
        return this.finished;
    }
}