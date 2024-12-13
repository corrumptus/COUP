import { COUPSocket } from "@socket/socket";
import MessageService from "@services/MessageService";
import PlayerService from "@services/PlayerService";
import Action from "@entitys/Action";
import CardType from "@entitys/CardType";
import Game from "@entitys/Game";
import Player, { CardSlot } from "@entitys/player";
import Religion from "@entitys/Religion";
import Turn from "@entitys/Turn";
import Config from "@utils/Config";

type PlayerBase = {
    name: string,
    money: number,
    religion?: Religion
}

export type SelfPlayer = {
    cards: { card: CardType, isDead: boolean }[]
} & PlayerBase;

export type EnemyPlayer = {
    cards: { card: CardType | undefined, isDead: boolean }[]
} & PlayerBase;

export enum ContextType {
    INVESTIGATING,
    BEING_ATTACKED,
    OBSERVING
}

export type GameState = {
    player: SelfPlayer,
    game: {
        players: EnemyPlayer[],
        currentPlayer: string,
        asylum: number,
        configs: Config
    },
    context: {
        type: ContextType.INVESTIGATING,
        card: CardType,
        selfCard: CardSlot,
        target: string,
        investigatedCard: CardType,
        targetCard: CardSlot
    } | {
        type: ContextType.BEING_ATTACKED,
        attacker: string,
        action: Action,
        card: CardType,
        attackedCard?: CardSlot,
        previousAction?: Action
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
    action: Action,
    card?: CardType,
    target?: string,
    attackedCard?: CardSlot,
    isInvestigating: boolean
}

export default class GameMessageService extends MessageService {
    static beginMatch(lobbyId: number) {
        const lobby = super.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        const game = lobby.getGame() as Game;

        super.sendDiscriminating(
            lobbyId,
            undefined,
            "beginMatch",
            (socket: COUPSocket, name: string) => [
                GameMessageService.calculateGameState(game, name, lobbyId),
                PlayerService.getSessionCode(socket.id)
            ]
        );
    }

    static reconnectGameState(lobbyId: number, name: string) {
        const lobby = super.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        const game = lobby.getGame() as Game;

        super.send(
            lobbyId,
            name,
            "reconnectingLobby",
            lobbyId
        );

        super.sendDiscriminating(
            lobbyId,
            name,
            "beginMatch",
            (socket: COUPSocket, name: string) => [
                GameMessageService.calculateGameState(game, name, lobby.id),
                PlayerService.getSessionCode(socket.id)
            ]
        );
    }

    private static calculateGameState(game: Game, name: string, lobbyId: number): GameState {
        const player = PlayerService.getPlayerByName(name, lobbyId) as Player;

        const state = game.getState();

        return {
            player: player.getState(),
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
        const lobby = super.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        super.sendDiscriminating(
            lobbyId,
            undefined,
            "updatePlayer",
            (_, name: string) => [
                GameMessageService.calculateNewGameState(lobbyId, game, name, infos)
            ]
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
            player: player.getState(),
            game: GameMessageService.gameStateForPlayer(gameState, name),
            context: GameMessageService.calculateGameContext(game, name, infos)
        }
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
            &&
            infos.action !== Action.TROCAR
            &&
            (
                (
                    infos.action === Action.CONTINUAR
                    &&
                    currentTurn.getAllActions().length === 2
                )
                ||
                infos.action !== Action.CONTINUAR
            )
        )
            return {
                type: ContextType.INVESTIGATING,
                card: currentTurn.getFirstCardType() as CardType,
                investigatedCard: (currentTurn.getTarget() as Player)
                    .getCard(currentTurn.getLastCard() as CardSlot).getType(),
                selfCard: currentTurn.getFirstCard() as CardSlot,
                target: (currentTurn.getTarget() as Player).name,
                targetCard: currentTurn.getLastCard() as CardSlot
            }

        if (
            name === infos.target
            &&
            ![
                undefined,
                Action.CONTESTAR,
                Action.GOLPE_ESTADO,
                Action.TROCAR
            ].includes(infos.action)
        )
            return {
                type: ContextType.BEING_ATTACKED,
                action: infos.action as Action,
                attackedCard: infos.attackedCard,
                attacker: infos.attacker,
                card: infos.card as CardType,
                previousAction: currentTurn.getAllActions().at(-2)
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

    static sendPlayerReconnecting(lobbyId: number, player: EnemyPlayer) {
        const lobby = super.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        super.sendDiscriminating(
            lobbyId,
            undefined,
            "addPlayer",
            () => [player]
        );
    }

    static sendPlayerDisconnecting(lobbyId: number, player: string) {
        const lobby = super.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        super.sendDiscriminating(
            lobbyId,
            undefined,
            "leavingPlayer",
            () => [player]
        );
    }
}