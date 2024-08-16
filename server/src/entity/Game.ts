import Turn from "./Turn";
import Player from "./player";
import Config from "../utils/Config";

export default class Game {
    private players: Player[];
    private currentPlayer: number;
    private nonKilledPlayers: string[];
    private turns: Turn[];
    private winner: Player | undefined = undefined;
    private onWin: () => void;
    private configs: Config;
    private asylum: number;

    constructor(players: Player[], onWin: () => void, configs: Config, currentPlayer?: number) {
        this.players = players;
        this.currentPlayer = currentPlayer || this.random;
        this.nonKilledPlayers = players.map(p => p.name);
        this.turns = [ new Turn(this.players[this.currentPlayer], this.nextPlayer) ];
        this.onWin = onWin;
        this.configs = configs;
        this.asylum = 0;

        this.deliverCardsAndMoney();
        this.tellPlayers();
    }

    deletePlayer(index: number) {
        if (index < 0 || index >= this.players.length)
            return;

        this.nonKilledPlayers.splice(index, 1);

        if (this.currentPlayer === index) {
            this.currentPlayer--;
            this.turns.pop();
            this.nextPlayer();
        }
    }

    private deliverCardsAndMoney() {
        this.players.forEach(player => player.initRound(this.configs.moedasIniciais));
    }

    private tellPlayers() {
        this.players.forEach(p => p.onPlayerDie(this.signDie(p.name)));
    }

    private signDie(name: string): () => void {
        return () => {
            const index = this.nonKilledPlayers.indexOf(name);

            if (index === -1)
                return;

            this.nonKilledPlayers.splice(index, 1);
        };
    }

    private get random(): number {
        return Math.floor(Math.random() * this.players.length);
    }

    nextPlayer() {
        if (this.someoneWin()) {
            this.winner = this.localizeWinner();
            this.onWin();
            return;
        }

        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;

        const newTurn = new Turn(this.players[this.currentPlayer], this.nextPlayer);

        this.turns.push(newTurn);
    }

    someoneWin(): boolean {
        return this.nonKilledPlayers.length === 1;
    }

    get isEnded(): boolean {
        return this.winner !== undefined;
    }

    private localizeWinner(): Player {
        return this.players.find(p => p.name === this.nonKilledPlayers[0]) as Player;
    }

    hasPlayer(player: Player): boolean {
        return this.players.includes(player);
    }

    getConfigs(): Config {
        return this.configs;
    }

    getAsylumCoins(): number {
        return this.asylum;
    }

    addAsylumCoins(amount: number) {
        if (amount <= 0)
            return;

        this.asylum += amount;
    }

    resetAsylumCoins() {
        this.asylum = 0;
    }

    getWinner(): Player | undefined {
        return this.winner;
    }

    getTurn(index: number): Turn | undefined {
        return this.turns.at(index);
    }

    removeLastTurn() {
        const lastTurn = this.turns[this.turns.length - 1];

        if (lastTurn === undefined)
            return;

        if (lastTurn.hasBeenStarted)
            return;

        this.turns.pop();
    }

    getState() {
        return {
            players: this.players.map(p => p.toEnemyInfo()),
            currentPlayer: this.players[this.currentPlayer].name,
            asylum: this.asylum,
            configs: this.configs
        };
    }
}