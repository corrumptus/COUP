import Card from "./Card";
import Religion, { randomReligion } from "./Religion";

export default class Player {
    readonly name: string;
    private cards: Card[];
    private religion: Religion | null;
    private money: number;
    private handlerDieEvent: () => void = () => {};

    constructor(name: string) {
        this.name = name;
        this.cards = [];
        this.religion = null;
        this.money = -1;
    }

    initRound(cards: Card[], money: number) {
        this.cards = cards;
        this.money = money;
    }

    initReligion() {
        if (this.religion !== null)
            return;

        this.religion = randomReligion();
    }

    addMoney(money: number) {
        if (money < 0)
            return;

        this.money += money;
    }

    getCard(position: number): Card | null {
        return this.cards[position] || null;
    }

    killCard(position: number) {
        this.cards[position]?.kill();

        if (!this.hasNonKilledCards)
            this.handlerDieEvent();
    }

    onPlayerDie(handler: () => void) {
        this.handlerDieEvent = handler;
    }

    get hasNonKilledCards(): boolean {
        return this.cards.filter(c => !c.getIsKilled()).length > 0;
    }
}