import Card from "./Card";
import Religion, { randomReligion } from "./Religion";

export default class Player {
    readonly name: string;
    private cards: Card[];
    private religion: Religion | undefined;
    private money: number;
    private handlerDieEvent: () => void = () => {};

    constructor(name: string) {
        this.name = name;
        this.cards = [];
        this.religion = undefined;
        this.money = -1;
    }

    initRound(cards: Card[], money: number) {
        this.cards = cards;
        this.money = money;
    }

    initReligion() {
        if (this.religion !== undefined)
            return;

        this.religion = randomReligion();
    }

    getMoney(): number {
        return this.money;
    }

    addMoney(money: number) {
        if (money < 0)
            return;

        this.money += money;
    }

    getCard(position: number): Card | undefined {
        return this.cards[position];
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

    toEnemyInfo() {
        return {
            name: this.name,
            cards: this.cards.map(c => ({
                card: c.getIsKilled() ? c.getType() : undefined,
                isDead: c.getIsKilled()
            })),
            money: this.money,
            religion: this.religion
        };
    }

    getState() {
        return {
            name: this.name,
            cards: this.cards.map(c => c.getState()),
            money: this.money,
            religion: this.religion
        };
    }
}