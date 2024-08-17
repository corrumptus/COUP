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

export function inverseReligion(religion: Religion) {
    return religion === Religion.PROTESTANTE ? Religion.CATOLICA : Religion.PROTESTANTE;
}

export default Religion;