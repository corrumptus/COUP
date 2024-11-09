import { faker } from "@faker-js/faker";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";
import { ContextType, GameState, PlayerState } from "@type/game";
import { randomCardType } from "./utils";

export default class GameStateFactory {
    private gameState: GameState;
    private isPlayerTurn: boolean;
    private playerName: string;
    private otherPlayerName: string;

    constructor() {
        this.playerName = faker.person.fullName();
        this.otherPlayerName = faker.person.fullName();

        this.isPlayerTurn = true;

        this.gameState = {
            player: {
                name: this.playerName,
                cards: [
                    {
                        card: randomCardType(),
                        isDead: false
                    },
                    {
                        card: randomCardType(),
                        isDead: false
                    }
                ],
                money: COUPDefaultConfigs.moedasIniciais,
                state: PlayerState.WAITING_TURN
            },
            game: {
                asylum: 0,
                configs: JSON.parse(JSON.stringify(COUPDefaultConfigs)),
                players: [
                    {
                        name: this.otherPlayerName,
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
                        money: COUPDefaultConfigs.moedasIniciais,
                    }
                ],
                currentPlayer: this.playerName,
            },
            context: {
                type: ContextType.OBSERVING,
                attacker: this.playerName,
                isInvestigating: false
            }
        }
    }

    create(): GameState {
        return this.gameState;
    }

    toOtherPlayerTurn(): this {
        this.gameState.game.currentPlayer = this.isPlayerTurn ?
            this.otherPlayerName
            :
            this.playerName;;

        this.isPlayerTurn != this.isPlayerTurn;

        return this;
    }

    newConfig(keys: string[], newValue: any | ((oldValue: any) => any)): this {
        let config: any = this.gameState.game.configs;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in config))
                return this;

            config = config[keys[i]];
        }

        const last = keys.length - 1;

        config[keys[last]] = typeof newValue === "function" ?
            newValue(config[keys[last]])
            :
            newValue;

        return this;
    }
}