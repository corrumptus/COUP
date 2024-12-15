import Card from "@entitys/Card";
import CardType, { randomCardType } from "@entitys/CardType";
import Religion, { inverseReligion, randomReligion } from "@entitys/Religion";

declare const cardSlotSymbol: unique symbol;

export type CardSlot = (0 | 1) & { [cardSlotSymbol]: "cardSlot" };

export function isCardSlot(cardSlot: any): cardSlot is CardSlot {
    return cardSlot === 0 || cardSlot === 1;
}

export default class Player {
    readonly name: string;
    private cards!: [Card, Card];
    private cardHistory: [CardType, CardType][];
    private religion: Religion | undefined;
    private money!: number;
    private moneyHistory: number[];
    private handlerDieEvent: () => void = () => {};

    constructor(name: string) {
        this.name = name;
        this.cardHistory = [];
        this.moneyHistory = [];
    }

    initRound(money: number, hasReligion: boolean) {
        const cards = this.newCards();

        this.cards = cards.map(c => new Card(c)) as [Card, Card];
        this.money = money;

        if(hasReligion)
            this.religion = randomReligion();
    }

    changeReligion() {
        this.religion = inverseReligion(this.religion as Religion);
    }

    getReligion(): Religion | undefined {
        return this.religion;
    }

    getMoney(): number {
        return this.money;
    }

    addMoney(money: number) {
        if (money < 0)
            return;

        this.moneyHistory.push(money);

        this.money += money;
    }

    removeMoney(money: number) {
        if (money < 0)
            return;

        if (this.money - money < 0)
            return;

        this.money -= money;
        this.moneyHistory.push(-money);
    }

    rollbackMoney(): number {
        if (this.moneyHistory.length === 0)
            return 0;

        const lastAddition = this.moneyHistory.at(-1) as number

        this.money -= lastAddition;

        this.moneyHistory.pop();

        return lastAddition;
    }

    getCards(): [Card, Card] {
        return this.cards;
    }

    getCard(position: CardSlot): Card {
        return this.cards[position];
    }

    getPreviousCards(): [CardType, CardType] | undefined {
        return this.cardHistory.at(-1);
    }

    changeCards() {
        this.cardHistory.push(this.cards.map(c => c.getType()) as [CardType, CardType]);

        const newCards = this.newCards();
        this.cards.forEach((c, i) => c.changeType(newCards[i]));
    }

    changeCard(position: CardSlot) {
        this.cardHistory.push(this.cards.map(c => c.getType()) as [CardType, CardType]);

        const newCard = randomCardType();

        this.cards[position].changeType(newCard);
    }

    rollbackCards() {
        if (this.cardHistory.length === 0)
            return;

        const lastCardTypes = this.cardHistory.at(-1) as [CardType, CardType];

        this.cards.forEach((c, i) => c.changeType(lastCardTypes[i]));

        this.cardHistory.pop();
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