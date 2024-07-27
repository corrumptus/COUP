import Game from "./Game";
import Player from "./player";
import COUPdefaultConfigs from "../../resources/COUPdefaultConfigs.json"
import Config from "../utils/Config";

export default class Lobby {
    readonly id: number;
    private currentGame: Game | null = null;
    private currentPlayers: Player[];
    private owner: Player | null;
    private configs: Config; 

    constructor(id: number, owner: Player) {
        this.id = id;
        this.currentPlayers = [owner];
        this.owner = owner;
        this.configs = COUPdefaultConfigs;
    }

    addPlayer(player: Player) {
        if (this.isRunningGame)
            return;

        this.currentPlayers.push(player);

        if (this.currentPlayers.length === 0)
            this.owner = player;
    }

    removePlayer(player: Player): number {
        if (player === null)
            return -1;

        const playerIndex = this.currentPlayers.findIndex(p => p === player);

        if (playerIndex === -1)
            return -1;

        if (this.owner === player) {
            if (this.currentPlayers.length > 1)
                this.owner = this.currentPlayers[playerIndex !== 0 ? 0 : 1];
            else
                this.owner = null;
        }

        if (this.currentGame !== null)
            this.currentGame.deletePlayer(playerIndex);

        return playerIndex;
    }

    newGame() {
        if (this.currentGame === null) {
            this.currentGame = new Game(
                this.currentPlayers,
                this.currentGameAlreadyFinish,
                { ...COUPdefaultConfigs, ...this.configs }
            );

            return;
        }

        if (!this.currentGame.isEnded)
            return;

        const winner = this.currentGame.getWinner();

        const winnerPosition = this.currentPlayers.findIndex(p => p === winner);

        this.currentGame = new Game(
            this.currentPlayers,
            this.currentGameAlreadyFinish,
            { ...COUPdefaultConfigs, ...this.configs },
            winnerPosition !== -1 ? 0 : winnerPosition
        );
    }

    currentGameAlreadyFinish() {
        this.currentGame = null;
    }

    get isRunningGame(): boolean {
        return this.currentGame !== null && !this.currentGame.isEnded;
    }

    get isEmpty(): boolean {
        return this.currentPlayers.length === 0;
    }

    getGame(): Game | null {
        return this.currentGame;
    }

    toLobbyFinder() {
        return {
            id: this.id,
            quantidadePlayers: this.currentPlayers.length,
            aberto: this.currentGame !== null
        }
    }

    updateConfigs(keys: string[], value: number | boolean) {
        let config: any = this.configs;

        for (let i = 0; i < keys.length - 1; i++)
            config = config[keys[i]];

        config[keys[keys.length - 1]] = value;
    }

    newOwner(player: Player) {
        this.owner = player;
    }

    isOwner(player: Player): boolean {
        return player === this.owner;
    }

    getState() {
        return {
            players: this.currentPlayers.map(p => p.name),
            owner: this.owner?.name || "",
            configs: this.configs
        };
    }
}