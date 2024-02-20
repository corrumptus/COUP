enum Religion {
    PROTESTANTE,
    CATOLICA
}

export function randomReligion(): Religion {
    const religions: Religion[] = [
        Religion.PROTESTANTE,
        Religion.CATOLICA
    ];

    return religions[Math.floor(Math.random()*religions.length)];
}

export default Religion;