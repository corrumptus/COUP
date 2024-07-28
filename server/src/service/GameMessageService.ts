import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Religion from "../entity/Religion";
import Config from "../utils/Config";
import MessageService from "./MessageService";

export enum PlayerState {
    WAITING_TURN = "waitingTurn",
    THINKING = "thinking",
    WAITING_REPLY = "waitingReply",
    BEING_ATTACKED = "beingAttacked",
    INVESTIGATING = "investigating",
    BEING_BLOCKED = "beingBlocked",
    NEED_TO_GOLPE_ESTADO = "needToGolpeEstado"
}

export type Player = {
    name: string,
    cards: { card: CardType | undefined, isDead: boolean }[],
    money: number,
    religion?: Religion,
    state: PlayerState
}

export enum ContextType {
    INVESTIGATING,
    BEING_ATTACKED,
    OBSERVING
}

export type GameState = {
    player: Player,
    game: {
        players: Omit<Player, "state">[],
        currentPlayer: string,
        asylum: number,
        configs: Config
    },
    context: {
        type: ContextType.INVESTIGATING,
        card: CardType,
        target: string,
        investigatedCard: CardType,
        targetCard: number
    } | {
        type: ContextType.BEING_ATTACKED,
        attacker: string,
        action: Action,
        card: CardType,
        attackedCard?: number,
        previousAction?: Action,
        preBlockAction?: Action
    } | {
        type: ContextType.OBSERVING,
        attacker: string,
        action?: Action,
        card?: CardType,
        target?: string,
        attackedCard?: number,
        isInvesting: boolean
    }
}

export default class GameMessageService extends MessageService {
    static initGameState(lobbyId: number) {
        const { lobby, players } = super.lobbys[lobbyId];

        const game = lobby.getGame() as Game;

        players.forEach(p =>
            p.socket.emit("beginMatch", GameMessageService.calculateGameState(game, p.name))
        );
    }

    private static calculateGameState(game: Game, playerName: string): GameState {

    }
}