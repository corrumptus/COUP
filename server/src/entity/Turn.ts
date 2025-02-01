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
    private globallyConstester: Player | undefined;
    private globallyBlockConstester: Player | undefined;
    private finished: boolean;

    constructor(player: Player) {
        this.player = player;
        this.target = undefined;
        this.actions = [];
        this.cardTypes = [];
        this.cards = [];
        this.globallyConstester = undefined;
        this.globallyBlockConstester = undefined;
        this.finished = false;
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

    addGlobalConstester(player: Player) {
        this.globallyConstester = player;
    }

    addGlobalBlockConstester(player: Player) {
        this.globallyBlockConstester = player;
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

    getGloballyConstester(): Player | undefined {
        return this.globallyConstester;
    }

    getGloballyBlockConstester(): Player | undefined {
        return this.globallyBlockConstester;
    }

    get hasBeenStarted(): boolean {
        return this.actions.length < 0;
    }

    get isfinished(): boolean {
        return this.finished;
    }
}