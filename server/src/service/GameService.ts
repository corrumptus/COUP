import type { COUPSocket } from "@socket/socket";
import ActionService from "@services/ActionService";
import GameMessageService from "@services/GameMessageService";
import LobbyService from "@services/LobbyService";
import MessageService from "@services/MessageService";
import SocketConnectionService from "@services/SocketConnectionService";
import SocketStoreService from "@services/SocketStoreService";
import Action from "@entitys/Action";
import type Game from "@entitys/Game";
import type Lobby from "@entitys/Lobby";
import type Player from "@entitys/player";
import BeginMatchValidator from "@validators/BeginMatchValidator";

export default class GameService {
    static setListeners(socket: COUPSocket) {
        socket.on("beginMatch", () => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId) as Lobby;

            if (!lobby.isOwner(socket.data.player))
                return;

            const error = BeginMatchValidator.validate(lobby);

            if (error !== undefined) {
                MessageService.sendToPlayerInLobby(
                    lobby.id,
                    socket.data.player.name,
                    [ "gameActionError", error ]
                );
                return;
            }

            GameService.beginMatch(lobby);

            SocketConnectionService.lobbyBeginMatch(lobby.id);
        });

        socket.on("renda", () => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;

            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.RENDA
            )
        });

        socket.on("ajudaExterna", () => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;

            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.AJUDA_EXTERNA
            )
        });

        socket.on("taxar", (card, selfCard) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;

            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.TAXAR,
                card,
                selfCard
            )
        });

        socket.on("corrupcao", (card, selfCard) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;
 
            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.CORRUPCAO,
                card,
                selfCard
            )
        });

        socket.on("extorquir", (card, selfCard, target) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;
 
            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.EXTORQUIR,
                card, 
                selfCard,
                target
            )
        });

        socket.on("assassinar", (card, selfCard, target, targetCard) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;
 
            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.ASSASSINAR,
                card,
                selfCard,
                target,
                targetCard
            )
        });

        socket.on("investigar", (card, selfCard, target, targetCard) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;
 
            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.INVESTIGAR,
                card,
                selfCard,
                target,
                targetCard
            )
        });

        socket.on("golpeEstado", (target, targetCard) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;
 
            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.GOLPE_ESTADO,
                undefined,
                undefined,
                target,
                targetCard
            )
        });

        socket.on("trocarPropriaReligiao", () => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;
 
            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.TROCAR_PROPRIA_RELIGIAO
            )
        });

        socket.on("trocarReligiaoOutro", (target) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;

            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.TROCAR_RELIGIAO_OUTRO,
                undefined,
                undefined,
                target
            )
        });

        socket.on("trocar", (card, selfCard, target, targetCard) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;
 
            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.TROCAR,
                card,
                selfCard,
                target,
                targetCard
            )
        });

        socket.on("bloquear", (card, selfCard) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;
 
            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.BLOQUEAR,
                card,
                selfCard
            )
        });

        socket.on("contestar", (selfCard) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;
 
            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.CONTESTAR,
                undefined,
                selfCard
            )
        });

        socket.on("continuar", () => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;
 
            GameService.socketEventHandler(
                socket.data.lobbyId,
                socket,
                Action.CONTINUAR
            )
        });

        socket.on("finishMatch", () => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;

            if (!lobby.isOwner(socket.data.player))
                return;

            LobbyService.finishMatch(lobby);
        });

        socket.on("restartMatch", () => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isRunningGame)
                return;

            if (!lobby.isOwner(socket.data.player))
                return;

            lobby.newGame();

            GameService.beginMatch(lobby);
        });
    }

    private static socketEventHandler(
        lobbyId: Lobby["id"],
        socket: COUPSocket,
        ...args: Parameters<typeof ActionService.makeAction> extends [infer _, ...args: infer P] ? P : any
    ) {
        try {
            const {
                actionInfos,
                turn
            } = ActionService.makeAction(socket.id, ...args);

            const game = GameService.getPlayersGame(socket.id) as Game;

            GameMessageService.updatePlayers(lobbyId, game, turn, actionInfos);
        } catch (error) {
            socket.emit("gameActionError", (error as Error).message);
        }
    }

    static getPlayersGame(lobbyId: Lobby["id"]): Game | undefined {
        const lobby = SocketStoreService.getLobby(lobbyId);

        if (lobby === undefined)
            return undefined;

        return lobby.getGame();
    }

    static beginMatch(lobby: Lobby) {
        const lastGame = lobby.getGame();

        if (lastGame !== undefined && lastGame.isEnded) {
            // save in the db
        }

        lobby.newGame();
        
        MessageService.sendToLobbyDiscriminating(
            lobby.id,
            socket => [
                "beginMatch",
                GameMessageService.calculateBeginGameState(
                    lobby.getGame() as Game,
                    socket.data.player
                )
            ]
        );
    }

    static addPlayer(socket: COUPSocket) {
        const { lobbyId, player } = socket.data;

        const lobby = SocketStoreService.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        const playerInfos = player.toEnemyInfo();

        MessageService.sendToLobby(lobbyId, [ "addPlayer", playerInfos ]);
    }

    static reconnectGameState(lobby: Lobby, player: Player) {
        MessageService.sendToPlayerInLobby(
            lobby.id,
            player.name,
            [ "reconnectingLobby", lobby.id ]
        );

        MessageService.sendToPlayerInLobby(
            lobby.id,
            player.name,
            [
                "beginMatch",
                GameMessageService.reconnectGameState(lobby.getGame() as Game, player)
            ]
        );
    }

    static removePlayer(lobby: Lobby, player: Player) {
        ActionService.revertTurn(lobby.id);

        MessageService.sendToLobby(lobby.id, [ "leavingPlayer", player.name ]);

        MessageService.sendToLobbyDiscriminating(
            lobby.id,
            socket => [
                "updatePlayer",
                GameMessageService.disconnectedPlayerNewGameState(
                    lobby,
                    socket.data.player
                )
            ]
        );
    }

    static removeListeners(socket: COUPSocket) {
        socket.removeAllListeners("renda");
        socket.removeAllListeners("ajudaExterna");
        socket.removeAllListeners("taxar");
        socket.removeAllListeners("corrupcao");
        socket.removeAllListeners("extorquir");
        socket.removeAllListeners("assassinar");
        socket.removeAllListeners("investigar");
        socket.removeAllListeners("golpeEstado");
        socket.removeAllListeners("trocarPropriaReligiao");
        socket.removeAllListeners("trocarReligiaoOutro");
        socket.removeAllListeners("trocar");
        socket.removeAllListeners("bloquear");
        socket.removeAllListeners("contestar");
        socket.removeAllListeners("continuar");
        socket.removeAllListeners("finishMatch");
        socket.removeAllListeners("restartMatch");
    }
}