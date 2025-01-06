import Game from "@entitys/Game";
import type Player from "@entitys/player";
import type Config from "@utils/Config";
import COUPdefaultConfigs from "@resources/COUPdefaultConfigs.json";

export default class Lobby {
    readonly id: number;
    private currentGame: Game | undefined;
    private players: Player[];
    private gamePlayers: string[];
    private owner: Player | undefined;
    private password: string | undefined;
    private configs: Config;

    constructor(id: number, owner: Player) {
        this.id = id;
        this.players = [owner];
        this.gamePlayers = [];
        this.owner = owner;
        this.password = undefined;
        this.configs = JSON.parse(JSON.stringify(COUPdefaultConfigs));
    }

    addPlayer(player: Player) {
        if (this.players.find(p => p.name === player.name) !== undefined)
            return;

        if (this.isRunningGame) {
            if (this.gamePlayers.find(p => p === player.name) === undefined)
                this.gamePlayers.push(player.name);
        } else {
            if (this.owner === undefined)
                this.owner = player;

            this.players.push(player);
        }
    }

    deletePlayer(playerName: string, deleteFromLobby: boolean) {
        if (this.players.find(p => p.name === playerName) === undefined)
            return;

        this.deleteFromGame(playerName, deleteFromLobby);

        const isLobbyEmpty = this.players.length === 0 ||
            (
                this.isRunningGame
                &&
                this.gamePlayers.length === 0
            );

        if (isLobbyEmpty) {
            this.resetLobby();
            return;
        }

        if (this.owner !== undefined && this.owner.name === playerName)
            this.assignNewOwner();

        if (this.isRunningGame)
            (this.currentGame as Game).deletePlayer(playerName);
    }

    private deleteFromGame(playerName: string, deleteFromLobby: boolean) {
        const gamePlayerIndex = this.gamePlayers.findIndex(p => p === playerName);

        this.gamePlayers.splice(gamePlayerIndex, 1);

        if (deleteFromLobby) {
            const playerIndex = this.players.findIndex(p => p.name === playerName);

            this.players.splice(playerIndex, 1);
        }
    }

    private assignNewOwner() {
        if (this.isRunningGame) {
            const firstGamePlayer = this.players.find(p => p.name === this.gamePlayers[0]) as Player;

            this.owner = firstGamePlayer;

            return;
        }

        this.owner = this.players[0];
    }

    hasPlayer(playerName: string) {
        return this.players.find(p => p.name === playerName) !== undefined;
    }

    newGame() {
        if (this.currentGame === undefined) {
            this.gamePlayers = this.players.map(p => p.name);
            this.currentGame = new Game(
                this.players.map(p => p),
                this.configs
            );

            return;
        }

        if (!this.currentGame.isEnded)
            return;

        this.gamePlayers = this.players.map(p => p.name);

        const winner = this.currentGame.getWinner();

        const winnerIndex = this.players.findIndex(p => p === winner);

        this.currentGame = new Game(
            this.players.map(p => p),
            this.configs,
            winnerIndex === -1 ? 0 : winnerIndex
        );
    }

    get isRunningGame(): boolean {
        return this.currentGame !== undefined && !this.currentGame.isEnded;
    }

    get isEmpty(): boolean {
        return this.players.length === 0;
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
            quantidadePlayers: this.players.length,
            aberto: this.password === undefined
        }
    }

    getConfigs() {
        return this.configs;
    }

    updateConfigs(keys: string[], value: number | boolean) {
        if (this.isRunningGame)
            return;

        let config: any = this.configs;

        for (let i = 0; i < keys.length - 1; i++)
            config = config[keys[i]];

        config[keys[keys.length - 1]] = value;
    }

    getOwner(): Player | undefined {
        return this.owner;
    }

    newOwner(player: Player) {
        if (!this.hasPlayer(player.name))
            return;

        this.owner = player;
    }

    isOwner(player: Player): boolean {
        return player === this.owner;
    }

    isOwnerName(name: string): boolean {
        return name === this.owner?.name;
    }

    newPassword(password: string) {
        this.password = password;
    }

    removePassword() {
        this.password = undefined;
    }

    private resetLobby() {
        this.currentGame = undefined;
        this.players = [];
        this.gamePlayers = [];
        this.owner = undefined;
        this.configs = COUPdefaultConfigs;
        this.password = undefined;
    }

    getState() {
        return {
            id: this.id,
            players: this.players.map(p => p.name),
            owner: this.owner?.name || "",
            configs: this.configs
        };
    }
}