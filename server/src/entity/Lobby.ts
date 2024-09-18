import Game from "./Game";
import Player from "./player";
import Config from "../utils/Config";
import COUPdefaultConfigs from "../../resources/COUPdefaultConfigs.json";

export default class Lobby {
    readonly id: number;
    private currentGame: Game | undefined;
    private currentPlayers: Player[];
    private owner: Player | undefined;
    private password: string | undefined;
    private configs: Config;

    constructor(id: number, owner: Player) {
        this.id = id;
        this.currentPlayers = [owner];
        this.owner = owner;
        this.password = undefined;
        this.configs = COUPdefaultConfigs;
    }

    addPlayer(player: Player) {
        if (this.isRunningGame)
            return;

        this.currentPlayers.push(player);

        if (this.currentPlayers.length === 0)
            this.owner = player;
    }

    removePlayer(player: Player) {
        const playerIndex = this.currentPlayers.findIndex(p => p === player);

        if (playerIndex === -1)
            return;

        if (this.owner === player) {
            if (this.currentPlayers.length > 1)
                this.owner = this.currentPlayers[playerIndex !== 0 ? 0 : 1];
            else
                this.owner = undefined;
        }

        if (this.currentGame !== undefined)
            this.currentGame.deletePlayer(playerIndex);

        this.currentPlayers.splice(playerIndex, 1);

        if (this.isEmpty) {
            this.configs = COUPdefaultConfigs;
            this.password = undefined;
        }
    }

    newGame() {
        if (this.currentGame === undefined) {
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
        this.currentGame = undefined;
    }

    get isRunningGame(): boolean {
        return this.currentGame !== undefined && !this.currentGame.isEnded;
    }

    get isEmpty(): boolean {
        return this.currentPlayers.length === 0;
    }

    getGame(): Game | undefined {
        return this.currentGame;
    }

    getPassword(): string | undefined {
        return this.password;
    }

    toLobbyFinder() {
        return {
            id: this.id,
            quantidadePlayers: this.currentPlayers.length,
            aberto: this.password === undefined
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

    newPassword(password: string) {
        this.password = password;
    }

    removePassword() {
        this.password = undefined;
    }

    getState() {
        return {
            players: this.currentPlayers.map(p => p.name),
            owner: this.owner?.name || "",
            configs: this.configs
        };
    }
}