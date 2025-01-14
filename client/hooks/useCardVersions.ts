import { EnemyPlayer } from "@type/game";
import { CardVersion } from "@type/gameUI";
import { useEffect, useState } from "react";

export type GameCardVersions = {
    player: [CardVersion, CardVersion],
    gamePlayers: {
        [n in EnemyPlayer["name"]]: [CardVersion, CardVersion]
    }
}

export default function useCardVersions(playerNames: string[]) {
    const [ cardVersions, setCardVersions ] = useState<GameCardVersions>({
        player: generateCardVersionPair(),
        gamePlayers: playerNames.reduce((prev, name) => ({
            ...prev,
            [name]: generateCardVersionPair()
        }), {})
    });

    useEffect(() => {
        const newCardVersions: GameCardVersions = JSON.parse(JSON.stringify(cardVersions));

        Object.keys(cardVersions.gamePlayers).forEach(name => {
            if (!playerNames.includes(name))
                delete newCardVersions.gamePlayers[name];
        });

        playerNames.forEach(name => {
            if (!(name in newCardVersions.gamePlayers))
                newCardVersions.gamePlayers[name] = generateCardVersionPair();
        });

        setCardVersions(newCardVersions);
    }, [JSON.stringify(playerNames)]);

    return cardVersions;
}

function generateCardVersionPair(): [CardVersion, CardVersion] {
    return [useRandomCardVersion(), useRandomCardVersion()];
}

export function useRandomCardVersion(): CardVersion {
    return Math.floor(Math.random() * 3) as CardVersion;
}