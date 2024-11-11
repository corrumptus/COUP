import { Card, Religion } from "@type/game";

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

export function randomReligion() {
    const random = Math.floor(Math.random() * 2);

    return [
        Religion.CATOLICA,
        Religion.PROTESTANTE
    ][random];
}