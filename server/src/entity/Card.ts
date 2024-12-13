import type CardType from "@entitys/CardType";

export default class Card {
    private type: CardType;
    private isDead: boolean;

    constructor(type: CardType) {
        this.type = type;
        this.isDead = false;
    }

    kill() {
        this.isDead = true;
    }

    changeType(type: CardType) {
        if (!this.isDead)
            this.type = type;
    }

    getType(): CardType {
        return this.type;
    }

    getIsKilled(): boolean {
        return this.isDead;
    }

    getState() {
        return {
            card: this.type,
            isDead: this.isDead
        }
    }
}