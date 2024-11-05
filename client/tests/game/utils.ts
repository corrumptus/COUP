import { Card } from "@type/game";

export function randomCardType() {
    const random = Math.floor(Math.random() * 6);

    return [
        Card.ASSASSINO,
        Card.CAPITAO,
        Card.CONDESSA,
        Card.DUQUE,
        Card.EMBAIXADOR,
        Card.INQUISIDOR
    ][random];
}