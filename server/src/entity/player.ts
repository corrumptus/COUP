import Card from "./Card";
import CardType, { randomCardType } from "./CardType";
import Religion, { randomReligion } from "./Religion";

export default class Player {
    readonly name: string;
    private cards: Card[];
    private cardHistory: CardType[][];
    private religion: Religion | undefined;
    private money: number;
    private handlerDieEvent: () => void = () => {};

    constructor(name: string) {
        this.name = name;
        this.cards = [];
        this.cardHistory = [];
        this.religion = undefined;
        this.money = -1;
    }

    initRound(money: number) {
        const cards = [
            randomCardType(),
            randomCardType()
        ];

        this.cards = cards.map(c => new Card(c));
        this.cardHistory.push(cards);
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

    removeMoney(money: number) {
        if (money < 0)
            return;

        if (this.money - money < 0)
            return;

        this.money -= money;
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

    get allCardsAreAlive(): boolean {
        return this.cards.filter(c => !c.getIsKilled()).length === 2;
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