import Turn from "@entitys/Turn";
import Player from "@entitys/player";
import Config from "@utils/Config";

export default class Game {
    private players: Player[];
    private currentPlayer: number;
    private nonKilledPlayers: string[];
    private turns: Turn[];
    private winner: Player | undefined = undefined;
    private onWin: () => void;
    private asylum: number;
    private configs: Config;

    constructor(players: Player[], onWin: () => void, configs: Config, currentPlayer?: number) {
        this.players = players;
        this.currentPlayer = currentPlayer || this.random;
        this.nonKilledPlayers = players.map(p => p.name);
        this.turns = [ new Turn(this.players[this.currentPlayer], () => this.nextPlayer()) ];
        this.onWin = onWin;
        this.asylum = 0;
        this.configs = configs;

        this.deliverCardsAndMoney();
        this.tellPlayers();
    }

    addPlayer(player: Player) {
        const hasPlayer = this.players.find(p => p.name === player.name) !== undefined;

        if (hasPlayer)
            return;

        this.players.push(player);
        this.nonKilledPlayers.push(player.name);
    }

    deletePlayer(playerName: string) {
        const indexP = this.players.findIndex(p => p.name === playerName);

        if (indexP === -1)
            return;

        this.players.splice(indexP, 1);

        const indexNP = this.nonKilledPlayers.findIndex(p => p === playerName);

        this.nonKilledPlayers.splice(indexNP, 1);

        if (this.currentPlayer === indexNP) {
            this.currentPlayer--;
            this.turns.pop();
            this.nextPlayer();
        }
    }

    private deliverCardsAndMoney() {
        const reforma = this.configs.religiao.reforma;

        this.players.forEach(player => {
            player.initRound(this.configs.moedasIniciais);

            if (reforma)
                player.initReligion();
        });
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
        if (this.nonKilledPlayers.length === 1) {
            this.winner = this.localizeWinner();
            this.onWin();
            return;
        }

        this.currentPlayer = (this.currentPlayer + 1) % this.nonKilledPlayers.length;

        const player = this.players
            .find(p => p.name === this.nonKilledPlayers[this.currentPlayer]) as Player;

        const newTurn = new Turn(player, () => this.nextPlayer());

        this.turns.push(newTurn);
    }

    get isEnded(): boolean {
        return this.winner !== undefined;
    }

    private localizeWinner(): Player {
        return this.players.find(p => p.name === this.nonKilledPlayers[0]) as Player;
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

    getLastTurn(): Turn {
        return this.turns.at(-1) as Turn;
    }

    removeLastTurn() {
        const lastTurn = this.turns[this.turns.length - 1];

        if (lastTurn === undefined)
            return;

        if (lastTurn.hasBeenStarted)
            return;

        this.turns.pop();
        this.currentPlayer = (this.currentPlayer - 1 + this.nonKilledPlayers.length)
            % this.nonKilledPlayers.length;
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