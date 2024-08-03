import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Player from "../entity/player";
import Religion from "../entity/Religion";
import Config from "../utils/Config";
import MessageService from "./MessageService";
import PlayerService from "./PlayerService";

export enum PlayerStateType {
    WAITING_TURN = "waitingTurn",
    THINKING = "thinking",
    WAITING_REPLY = "waitingReply",
    BEING_ATTACKED = "beingAttacked",
    INVESTIGATING = "investigating",
    BEING_BLOCKED = "beingBlocked",
    NEED_TO_GOLPE_ESTADO = "needToGolpeEstado"
}

export type PlayerState = {
    name: string,
    cards: { card: CardType | undefined, isDead: boolean }[],
    money: number,
    religion?: Religion,
    state: PlayerStateType
}

export enum ContextType {
    INVESTIGATING,
    BEING_ATTACKED,
    OBSERVING
}

export type GameState = {
    player: PlayerState,
    game: {
        players: Omit<PlayerState, "state">[],
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

export type ActionInfos = {
    attacker: string,
    action?: Action,
    card?: CardType,
    target?: string,
    attackedCard?: number,
    isInvesting: boolean
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
        const player = PlayerService.getPlayerByName(playerName) as Player;

        const state = game.getState();

        return {
            player: {
                ...player.getState(),
                state: state.currentPlayer === player.name
                    ? PlayerStateType.THINKING : PlayerStateType.WAITING_TURN
            },
            game: state,
            context: {
                type: ContextType.OBSERVING,
                attacker: state.currentPlayer,
                isInvesting: false
            }
        }
    }

    static updatePlayers(
        lobbyId: number,
        gameState: ReturnType<Game["getState"]>,
        infos: ActionInfos
    ) {
        const { players } = super.lobbys[lobbyId];

        players.forEach(
            p => p.socket.emit(
                "updatePlayer",
                GameMessageService.calculateNewGameState(gameState, p.name, infos)
            )
        );
    }

    private static calculateNewGameState(
        gameState: ReturnType<Game["getState"]>,
        name: string,
        infos: ActionInfos
    ): GameState {
        
    }
}