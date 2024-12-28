import Game from "@entitys/Game";
import type Player from "@entitys/player";
import type Config from "@utils/Config";
import COUPdefaultConfigs from "@resources/COUPdefaultConfigs.json";

export default class Lobby {
    readonly id: number;
    private currentGame: Game | undefined;
    private players: Player[];
    private gamePlayers: string[] | undefined;
    private owner: Player | undefined;
    private password: string | undefined;
    private configs: Config;

    constructor(id: number, owner: Player) {
        this.id = id;
        this.players = [owner];
        this.gamePlayers = undefined;
        this.owner = owner;
        this.password = undefined;
        this.configs = JSON.parse(JSON.stringify(COUPdefaultConfigs));
    }

    addPlayer(player: Player) {
        if (this.currentGame === undefined) {
            if (this.owner === undefined)
                this.owner = player;

            this.players.push(player);
            return;
        }

        if (this.players.find(p => p.name === player.name) === undefined)
            return;

        (this.gamePlayers as string[]).push(player.name);
    }

    removePlayer(playerName: string) {
        if (
            this.currentGame === undefined ||
            this.currentGame.isEnded ||
            this.gamePlayers === undefined
        )
            return;

        const index = this.gamePlayers.findIndex(p => p === playerName);

        if (index === -1)
            return;

        this.gamePlayers.splice(index, 1);

        if (this.gamePlayers.length === 0) {
            this.resetLobby();
            return;
        }

        if (this.owner !== undefined && this.owner.name === playerName) {
            const name = this.gamePlayers[0];

            this.owner = this.players.find(p => p.name === name);
        }

        this.currentGame.deletePlayer(playerName);
    }

    deletePlayer(playerName: string) {
        const indexP = this.players.findIndex(p => p.name === playerName);

        if (indexP === -1)
            return;

        this.players.splice(indexP, 1);

        if (this.players.length === 0) {
            this.resetLobby();
            return;
        }

        if (this.owner !== undefined && this.owner.name === playerName) {
            this.owner = this.players[0];
        }

        if (
            this.currentGame === undefined ||
            this.currentGame.isEnded ||
            this.gamePlayers === undefined
        )
            return;

        const indexGP = this.gamePlayers.findIndex(p => p === playerName);

        this.gamePlayers.splice(indexGP, 1);

        this.currentGame.deletePlayer(playerName);
    }

    newGame() {
        if (this.currentGame === undefined) {
            this.currentGame = new Game(
                this.players,
                { ...COUPdefaultConfigs, ...this.configs }
            );

            return;
        }

        if (!this.currentGame.isEnded)
            return;

        const winner = this.currentGame.getWinner();

        const winnerPosition = this.players.findIndex(p => p === winner);

        this.currentGame = new Game(
            this.players.map(p => p),
            { ...COUPdefaultConfigs, ...this.configs },
            winnerPosition === -1 ? 0 : winnerPosition
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

    updateConfigs(keys: string[], value: number | boolean) {
        let config: any = this.configs;

        for (let i = 0; i < keys.length - 1; i++)
            config = config[keys[i]];

        config[keys[keys.length - 1]] = value;
    }

    getOwner(): Player | undefined {
        return this.owner;
    }

    newOwner(player: Player) {
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
        this.gamePlayers = undefined;
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