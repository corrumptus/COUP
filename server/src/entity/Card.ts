import CardType from "./CardType";

export default class Card {
    private type: CardType;
    private iskilled: boolean;

    constructor(type: CardType) {
        this.type = type;
        this.iskilled = false;
    }

    kill() {
        this.iskilled = true;
    }

    changeType(type: CardType) {
        if (!this.iskilled)
            this.type = type;
    }

    getType(): CardType {
        return this.type;
    }

    getIsKilled(): boolean {
        return this.iskilled;
    }
}