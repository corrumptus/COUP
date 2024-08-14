import Action from "./Action";
import CardType from "./CardType";
import Player from "./player";

export default class Turn {
    private player: Player;
    private target: Player | undefined;
    private actions: Action[];
    private cardTypes: CardType[];
    private cards: number[];
    private finished: boolean;
    private onFinish: () => void;

    constructor(player: Player, onFinish: () => void) {
        this.player = player;
        this.target = undefined;
        this.actions = [];
        this.cardTypes = [];
        this.cards = [];
        this.finished = false;
        this.onFinish = onFinish;
    }

    addAction(action: Action) {
        this.actions.push(action);
    }

    addTarget(target: Player) {
        if (this.target === undefined)
            this.target = target;
    }

    finish() {
        this.onFinish();
        this.finished = true;
    }

    getPlayer(): Player {
        return this.player;
    }

    getTarget(): Player | undefined {
        return this.target;
    }

    getLastAction(): Action | undefined {
        return this.actions[this.actions.length - 1];
    }

    getFirstAction(): Action | undefined {
        return this.actions[0];
    }

    get hasBeenStarted(): boolean {
        return this.actions.length < 0;
    }

    get isfinished(): boolean {
        return this.finished;
    }
}