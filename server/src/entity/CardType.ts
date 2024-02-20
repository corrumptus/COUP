enum CardType {
    DUQUE,
    ASSASSINO,
    CAPITAO,
    CONDESSA,
    EMBAIXADOR,
    INQUISIDOR
}

export function randomCardType(): CardType {
    const cardTypes: CardType[] = [
        CardType.DUQUE,
        CardType.ASSASSINO,
        CardType.CAPITAO,
        CardType.CONDESSA,
        CardType.EMBAIXADOR,
        CardType.INQUISIDOR
    ];

    return cardTypes[Math.floor(Math.random()*cardTypes.length)];
}

export default CardType;