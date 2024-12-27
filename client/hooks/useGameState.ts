import { useState } from "react";
import { GameState, Card, ContextType } from "@type/game";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";

export default function useGameState() {
    const state = useState<GameState>({
        player: {
            cards: [
                {
                    card: Card.ASSASSINO,
                    isDead: false
                },
                {
                    card: Card.CAPITAO,
                    isDead: false
                }
            ],
            money: 0,
            name: "PlayerName",
            religion: undefined
        },
        game: {
            asylum: 0,
            configs: COUPDefaultConfigs,
            currentPlayer: "CurrentPlayer",
            players: [
                {
                    name: "enemyPlayer",
                    money: 0,
                    cards: [
                        {
                            card: undefined,
                            isDead: false
                        },
                        {
                            card: undefined,
                            isDead: false
                        }
                    ],
                    religion: undefined
                }
            ],
            winner: undefined
        },
        context: {
            type: ContextType.OBSERVING,
            attacker: "attacker",
            isInvestigating: false,
            winContesting: false
        }
    });

    return state;
}