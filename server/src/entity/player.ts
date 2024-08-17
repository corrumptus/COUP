import Card from "./Card";
import CardType, { randomCardType } from "./CardType";
import Religion, { inverseReligion, randomReligion } from "./Religion";

export type CardSlot = 0 | 1;

export default class Player {
    readonly name: string;
    private cards!: [Card, Card];
    private cardHistory: [CardType, CardType][];
    private religion: Religion | undefined;
    private money!: number;
    private handlerDieEvent: () => void = () => {};

    constructor(name: string) {
        this.name = name;
        this.cardHistory = [];
    }

    initRound(money: number) {
        const cards = this.newCards();

        this.cards = cards.map(c => new Card(c)) as [Card, Card];
        this.cardHistory.push(cards);
        this.money = money;
    }

    initReligion() {
        if (this.religion !== undefined)
            return;

        this.religion = randomReligion();
    }

    changeReligion() {
        this.religion = inverseReligion(this.religion as Religion);
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

    getCards(): [Card, Card] {
        return this.cards;
    }

    getCard(position: CardSlot): Card {
        return this.cards[position];
    }

    changeCards() {
        const newCards = this.newCards();

        this.cards.forEach((c, i) => c.changeType(newCards[i]));
        this.cardHistory.push(newCards);
    }

    changeCard(position: CardSlot) {
        const newCard = randomCardType();

        this.cards[position].changeType(newCard);

        const newCardHistory = this.cards.map(c => c.getType()) as [CardType, CardType];

        this.cardHistory.push(newCardHistory);
    }

    getPreviousCards(): [CardType, CardType] | undefined {
        return this.cardHistory.at(-2);
    }

    killCard(position: CardSlot) {
        this.cards[position].kill();

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

    private newCards(): [CardType, CardType] {
        return [
            randomCardType(),
            randomCardType()
        ];
    }
}