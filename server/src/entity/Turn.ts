import Action, { postActions, targetActions } from "./Action";
import Player from "./player";

export default class Turn {
    private player: Player;
    private target: Player | null;
    private actions: Action[];
    private onFinish: () => void;

    constructor(player: Player, onFinish: () => void) {
        this.player = player;
        this.target = null;
        this.actions = [];
        this.onFinish = onFinish;
    }

    addAction(action: Action, target?: Player) {
        const lastAction = this.actions[this.actions.length - 1];

        if (postActions[lastAction].indexOf(action) === -1)
            return;

        if (targetActions.indexOf(action) !== -1 && target === undefined)
            return;

        if (targetActions.indexOf(action) !== -1 && target !== undefined)
            this.target = target;

        this.actions.push(action);
    }

    finish() {
        this.onFinish();
    }

    getPlayer(): Player {
        return this.player;
    }

    getTarget(): Player | null {
        return this.target;
    }
}