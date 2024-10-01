import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Player, { CardSlot } from "../entity/player";
import Religion from "../entity/Religion";
import Turn from "../entity/Turn";
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
        targetCard: CardSlot
    } | {
        type: ContextType.BEING_ATTACKED,
        attacker: string,
        action: Action,
        card: CardType,
        attackedCard?: CardSlot,
        previousAction?: Action,
        preBlockAction?: Action
    } | {
        type: ContextType.OBSERVING,
        attacker: string,
        action?: Action,
        card?: CardType,
        target?: string,
        attackedCard?: CardSlot,
        isInvestigating: boolean
    }
}

export type ActionInfos = {
    attacker: string,
    action?: Action,
    cardType?: CardType,
    target?: string,
    attackedCard?: CardSlot,
    isInvestigating: boolean
}

export default class GameMessageService extends MessageService {
    static initGameState(lobbyId: number) {
        const { lobby, players } = super.lobbys[lobbyId];

        const game = lobby.getGame() as Game;

        players.forEach(p =>
            p.socket.emit("beginMatch", GameMessageService.calculateGameState(game, p.name, lobby.id))
        );
    }

    private static calculateGameState(game: Game, playerName: string, lobbyId: number): GameState {
        const player = PlayerService.getPlayerByName(playerName, lobbyId) as Player;

        const state = game.getState();

        return {
            player: {
                ...player.getState(),
                state: state.currentPlayer === player.name
                    ? PlayerStateType.THINKING : PlayerStateType.WAITING_TURN
            },
            game: GameMessageService.gameStateForPlayer(state, player.name),
            context: {
                type: ContextType.OBSERVING,
                attacker: state.currentPlayer,
                isInvestigating: false
            }
        }
    }

    static updatePlayers(
        lobbyId: number,
        game: Game,
        infos: ActionInfos
    ) {
        const { players } = super.lobbys[lobbyId];

        players.forEach(
            p => p.socket.emit(
                "updatePlayer",
                GameMessageService.calculateNewGameState(lobbyId, game, p.name, infos)
            )
        );
    }

    private static calculateNewGameState(
        lobbyId: number,
        game: Game,
        name: string,
        infos: ActionInfos
    ): GameState {
        const player = PlayerService.getPlayerByName(name, lobbyId) as Player;

        const gameState = game.getState();

        return {
            player: {
                ...player.getState(),
                state: GameMessageService.calculatePlayerState(gameState, name, infos)
            },
            game: GameMessageService.gameStateForPlayer(gameState, name),
            context: GameMessageService.calculateGameContext(game, name, infos)
        }
    }

    private static calculatePlayerState(
        gameState: ReturnType<Game["getState"]>,
        name: string,
        infos: ActionInfos
    ): PlayerStateType {
        if (
            name !== gameState.currentPlayer
            &&
            name !== infos.target
        )
            return PlayerStateType.WAITING_TURN;

        if (
            name !== gameState.currentPlayer
            &&
            name === infos.target
            &&
            infos.action !== Action.BLOQUEAR
        )
            return PlayerStateType.BEING_ATTACKED;

        if (
            name !== gameState.currentPlayer
            &&
            name === infos.target
            &&
            infos.action === Action.BLOQUEAR
        )
            return PlayerStateType.BEING_BLOCKED;

        if (
            name === gameState.currentPlayer
            &&
            (gameState.players.find(p => p.name === name) as Omit<PlayerState, "state">)
                .money >= gameState.configs.quantidadeMaximaGolpeEstado
        )
            return PlayerStateType.NEED_TO_GOLPE_ESTADO;

        if (
            name === gameState.currentPlayer
            &&
            infos.isInvestigating
        )
            return PlayerStateType.INVESTIGATING;

        if (
            name === gameState.currentPlayer
            &&
            name === infos.attacker
        )
            return PlayerStateType.WAITING_REPLY;

        return PlayerStateType.THINKING;
    }

    private static calculateGameContext(
        game: Game,
        name: string,
        infos: ActionInfos
    ): GameState["context"] {
        const gameState = game.getState();

        const currentTurn = game.getTurn(-1) as Turn;

        if (
            name === gameState.currentPlayer
            &&
            infos.isInvestigating
        )
            return {
                type: ContextType.INVESTIGATING,
                card: currentTurn.getFirstCardType() as CardType,
                target: (currentTurn.getTarget() as Player).name,
                investigatedCard: currentTurn.getLastCardType() as CardType,
                targetCard: currentTurn.getLastCard() as CardSlot
            }

        if (
            name === infos.target
        )
            return {
                type: ContextType.BEING_ATTACKED,
                attacker: infos.attacker,
                action: infos.action as Action,
                card: infos.cardType as CardType,
                attackedCard: infos.attackedCard,
                previousAction: currentTurn.getAllActions().at(-2),
                preBlockAction: currentTurn.getFirstAction()
            }

        return {
            type: ContextType.OBSERVING,
            ...infos
        }
    }

    private static gameStateForPlayer(
        gameState: GameState["game"],
        playerName: string
    ): GameState["game"] {
        return { ...gameState, players: gameState.players.filter(p => p.name !== playerName) }
    }
}