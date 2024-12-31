import CardType from "@entitys/CardType";
import type Player from "@entitys/player";
import Religion from "@entitys/Religion";
import Turn from "@entitys/Turn";
import type Config from "@utils/Config";

export default class Game {
    private players: Player[];
    private currentPlayer: number;
    private nonKilledPlayers: string[];
    private turns: Turn[];
    private winner: Player | undefined = undefined;
    private asylum: number;
    private configs: Config;

    constructor(players: Player[], configs: Config, currentPlayer?: number) {
        this.players = players;
        this.currentPlayer = currentPlayer || this.random;
        this.nonKilledPlayers = players.map(p => p.name);
        this.turns = [ new Turn(this.players[this.currentPlayer], () => this.nextPlayer()) ];
        this.asylum = configs.religiao.moedasIniciaisAsilo;
        this.configs = configs;

        this.deliverCardsAndMoney();
        this.tellPlayers();
    }

    addPlayer(player: Player) {
        const hasPlayer = this.players.find(p => p.name === player.name) !== undefined;

        if (hasPlayer)
            return;

        player.onPlayerDie(() => this.signDie(player.name));

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

        if (this.nonKilledPlayers.length === 1)
            this.localizeWinner();
    }

    private deliverCardsAndMoney() {
        const reforma = this.configs.religiao.reforma;

        this.players.forEach(p => p.initRound(this.configs.moedasIniciais, reforma));
    }

    private tellPlayers() {
        this.players.forEach(p => p.onPlayerDie(this.signDie(p.name)));
    }

    private signDie(name: string): () => void {
        const index = this.nonKilledPlayers.indexOf(name);

        if (index === -1)
            return () => {};

        return () => this.nonKilledPlayers.splice(index, 1);
    }

    private get random(): number {
        return Math.floor(Math.random() * this.players.length);
    }

    nextPlayer() {
        if (this.nonKilledPlayers.length === 1) {
            this.localizeWinner();
            return;
        }

        this.currentPlayer = (this.currentPlayer + 1) % this.nonKilledPlayers.length;

        const player = this.players
            .find(p => p.name === this.nonKilledPlayers[this.currentPlayer]) as Player;

        this.turns.push(new Turn(player, () => this.nextPlayer()));
    }

    get isEnded(): boolean {
        return this.winner !== undefined;
    }

    private localizeWinner() {
        this.winner = this.players.find(p => p.name === this.nonKilledPlayers[0]);
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

    getState(): {
        players: {
            name: string;
            cards: {
                card: CardType | undefined;
                isDead: boolean;
            }[];
            money: number;
            religion: Religion | undefined;
        }[],
        currentPlayer: string,
        asylum: number,
        configs: Config,
        winner?: string
    } {
        return this.winner !== undefined ?
        {
            players: this.players.map(p => p.toEnemyInfo()),
            currentPlayer: this.players[this.currentPlayer].name,
            asylum: this.asylum,
            configs: this.configs,
            winner: this.winner.name
        }
        :
        {
            players: this.players.map(p => p.toEnemyInfo()),
            currentPlayer: this.players[this.currentPlayer].name,
            asylum: this.asylum,
            configs: this.configs
        };
    }
}