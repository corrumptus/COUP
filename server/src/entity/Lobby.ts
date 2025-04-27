import Game from "@entitys/Game";
import type Player from "@entitys/player";
import type Config from "@utils/Config";
import COUPdefaultConfigs from "@resources/COUPdefaultConfigs.json";

export default class Lobby {
    readonly id: string;
    private currentGame: Game | undefined;
    private players: Player[];
    private owner: Player;
    private password: string | undefined;
    private configs: Config;

    constructor(id: string, owner: Player) {
        this.id = id;
        this.players = [owner];
        this.owner = owner;
        this.password = undefined;
        this.configs = JSON.parse(JSON.stringify(COUPdefaultConfigs));
    }

    addPlayer(player: Player) {
        if (this.players.find(p => p.name === player.name) !== undefined)
            return;
        
        this.players.push(player);

        if (this.isRunningGame)
            (this.currentGame as Game).addPlayer(player);
    }

    removePlayer(player: Player) {
        const index = this.players.indexOf(player);

        if (index === -1)
            return;

        this.players.splice(index, 1);

        if (this.owner === player)
            this.owner = this.players[0];

        if (this.isRunningGame)
            (this.currentGame as Game).deletePlayer(player);
    }

    hasPlayer(playerName: string) {
        return this.players.find(p => p.name === playerName) !== undefined;
    }

    newGame() {
        if (this.currentGame === undefined) {
            this.currentGame = new Game(
                [...this.players],
                this.configs
            );

            return;
        }

        if (!this.currentGame.isEnded)
            return;

        const winner = this.currentGame.getWinner();

        const winnerIndex = this.players.findIndex(p => p === winner);

        this.currentGame = new Game(
            [...this.players],
            this.configs,
            winnerIndex === -1 ? 0 : winnerIndex
        );
    }

    get isRunningGame(): boolean {
        return this.currentGame !== undefined && !this.currentGame.isEnded;
    }

    getGame(): Game | undefined {
        return this.currentGame;
    }

    hasPassword(): boolean {
        return this.password !== undefined;
    }

    isLobbyPassword(password: string) {
        return this.password === password;
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

    getOwner(): Player {
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

    newPassword(password: string) {
        this.password = password;
    }

    removePassword() {
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