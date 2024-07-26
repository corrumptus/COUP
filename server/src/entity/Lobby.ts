import Game from "./Game";
import Player from "./player";
import COUPdefaultConfigs from "../../resources/COUPdefaultConfigs.json"
import Config from "../utils/Config";

export default class Lobby {
    readonly id: number;
    private currentGame: Game | null = null;
    private currentPlayers: Player[];
    private owner: Player;
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

    removePlayer(player: Player | null) {
        if (player === null)
            return;

        this.currentPlayers = this.currentPlayers.filter((p, i, players) => {
            if (p !== player)
                return true;

            if (this.owner === player)
                this.owner = players[i !== 0 ? 0 : 1];

            return false;
        });

        if (this.currentGame === null)
            return;

        this.currentGame.deletePlayer(player);
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
}