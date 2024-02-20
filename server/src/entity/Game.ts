import Card from "./Card";
import { randomCardType } from "./CardType";
import Turn from "./Turn";
import Player from "./player";
import Config from "../utils/Config";

export default class Game {
    private players: Player[];
    private currentPlayer: number;
    private nonKilledPlayers: string[];
    private turns: Turn[];
    private winner: Player | null = null;
    private onWin: () => void;
    private configs: Config;

    constructor(players: Player[], onWin: () => void, configs: Config, currentPlayer?: number) {
        this.players = players;
        this.currentPlayer = currentPlayer || this.random;
        this.nonKilledPlayers = players.map(p => p.name);
        this.turns = [ new Turn(this.players[this.currentPlayer], this.nextPlayer) ];
        this.onWin = onWin;
        this.configs = configs;

        this.deliverCardsAndMoney();
        this.tellPlayers();
    }

    deletePlayer(player: Player) {
        this.nonKilledPlayers.filter(name => name !== player.name);

        this.players.filter((p, index) => {
            if (p !== player)
                return true;

            if (this.currentPlayer === index) {
                this.currentPlayer--;
                this.turns.pop();
                this.nextPlayer();
            }

            return false;
        })
    }

    private deliverCardsAndMoney() {
        this.players.forEach(player => {
            const cards: Card[] = [
                new Card(randomCardType()),
                new Card(randomCardType())
            ];

            player.initRound(cards, this.configs.quantidadeMoedasIniciais);
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
        return this.winner !== null;
    }

    private localizeWinner(): Player {
        return this.players.find(p => p.name === this.nonKilledPlayers[0]) as Player;
    }

    getWinner(): Player | null {
        return this.winner;
    }

    getTurn(player: Player | null): Turn | null {
        if (player === null)
            return null;

        if (!this.players.includes(player))
            return null;

        const lastTurn: Turn = this.turns[this.turns.length - 1];
        const isPlayersTurn: boolean = lastTurn.getPlayer() === player;
        const isPlayerTarget: boolean = lastTurn.getTarget() === player;

        if (!isPlayersTurn && !isPlayerTarget)
            return null;

        return lastTurn;
    }
}