import type Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import type Player from "@entitys/player";
import type { CardSlot } from "@entitys/player";

export default class Turn {
    private player: Player;
    private target: Player | undefined;
    private actions: Action[];
    private cardTypes: CardType[];
    private cards: CardSlot[];
    private contester: Player | undefined;
    private blocker: Player | undefined;
    private blockContester: Player | undefined;
    private finished: boolean;
    private currentPlayer: Player;

    constructor(player: Player) {
        this.player = player;
        this.target = undefined;
        this.actions = [];
        this.cardTypes = [];
        this.cards = [];
        this.contester = undefined;
        this.blocker = undefined;
        this.blockContester = undefined;
        this.finished = false;
        this.currentPlayer = player;
    }

    addAction(action: Action) {
        this.actions.push(action);
    }

    addTarget(target: Player) {
        if (this.target === undefined)
            this.target = target;
    }

    addCardType(cardType: CardType) {
        this.cardTypes.push(cardType);
    }

    addCard(card: CardSlot) {
        this.cards.push(card);
    }

    addContester(player: Player) {
        this.contester = player;
    }

    addBlocker(player: Player) {
        this.blocker = player;
    }

    addBlockContester(player: Player) {
        this.blockContester = player;
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

    getFirstAction(): Action | undefined {
        return this.actions[0];
    }

    getLastAction(): Action | undefined {
        return this.actions[this.actions.length - 1];
    }

    getAllActions(): Action[] {
        return this.actions;
    }

    getAllCards(): CardSlot[] {
        return this.cards;
    }

    getAllCardTypes(): CardType[] {
        return this.cardTypes;
    }

    getFirstCardType(): CardType | undefined {
        return this.cardTypes[0];
    }

    getFirstCard(): CardSlot | undefined {
        return this.cards[0];
    }

    getLastCard(): CardSlot | undefined {
        return this.cards.at(-1);
    }

    getLastCardType(): CardType | undefined {
        return this.cardTypes.at(-1);
    }

    getContester(): Player | undefined {
        return this.contester;
    }

    getBlocker(): Player | undefined {
        return this.blocker;
    }

    getBlockContester(): Player | undefined {
        return this.blockContester;
    }

    getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    setCurrentPlayer(player: Player) {
        this.currentPlayer = player;
    }

    get hasBeenStarted(): boolean {
        return this.actions.length < 0;
    }

    get isfinished(): boolean {
        return this.finished;
    }
}