import Action from "@entitys/Action";
import CardType from "@entitys/CardType";
import Player, { CardSlot } from "@entitys/player";

export default class Turn {
    private player: Player;
    private target: Player | undefined;
    private actions: Action[];
    private cardTypes: CardType[];
    private cards: CardSlot[];
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

    addCardType(cardType: CardType) {
        this.cardTypes.push(cardType);
    }

    addCard(card: CardSlot) {
        this.cards.push(card);
    }

    finish(shouldCallOnFinish: boolean = true) {
        this.finished = true;

        if (shouldCallOnFinish)
            this.onFinish();
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

    get hasBeenStarted(): boolean {
        return this.actions.length < 0;
    }

    get isfinished(): boolean {
        return this.finished;
    }
}