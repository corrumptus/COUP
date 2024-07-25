import Game from "./Game";
import Player from "./player";
import COUPdefaultConfigs from "../../resources/COUPdefaultConfigs.json"
import Config from "../utils/Config";

export default class Lobby {
    readonly id: number;
    private games: Game[] = [];
    private currentGame: Game | null = null;
    private currentPlayers: Player[];
    private owner: Player;

    constructor(id: number, owner: Player) {
        this.id = id;
        this.currentPlayers = [owner];
        this.owner = owner;
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

    newGame(customConfigs?: Config) {
        if (this.currentGame === null) {
            this.currentGame = new Game(
                this.currentPlayers,
                this.currentGameAlreadyFinish,
                {
                    ...((COUPdefaultConfigs as unknown) as Config),
                    ...customConfigs
                }
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
            {
                ...((COUPdefaultConfigs as unknown) as Config),
                ...customConfigs
            },
            winnerPosition !== -1 ? 0 : winnerPosition
        );
    }

    currentGameAlreadyFinish() {
        this.games.push(this.currentGame as Game);

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
}