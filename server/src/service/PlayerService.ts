import { DisconnectReason } from "socket.io";
import Player from "../entity/player";
import LobbyService from "./LobbyService";
import Lobby from "../entity/Lobby";
import { COUPSocket } from "../socket/socket";
import UserService from "./UserService";

export default class PlayerService {
    private static players: {
        [socketId: string]: {
            player: Player,
            lobbyId: number,
            isLogged: boolean,
            socket: COUPSocket,
            userAgent: string | undefined,
            sessionCode: string
        }
    } = {};

    private static reconnectionPlayers: {
        [sessionCode: string]: {
            player: Player,
            lobbyId: number,
            isLogged: boolean,
            userAgent: string | undefined
        }
    } = {};

    static async setListeners(socket: COUPSocket) {
        await PlayerService.declare(socket);

        socket.on("disconnect", (reason: DisconnectReason) => {
            if (
                [
                    "client namespace disconnect",
                    "server namespace disconnect",
                    "server shutting down"
                ]
                    .includes(reason)
            ) {
                const { lobbyId, player: { name } } = PlayerService.players[socket.id];

                PlayerService.deletePlayer(socket.id, "player desconectou");

                LobbyService.messagePlayerConnectionState("leavingPlayer", lobbyId, name);
            } else {
                const { sessionCode, socket: _, ...playerInfos } = PlayerService.players[socket.id];

                PlayerService.reconnectionPlayers[sessionCode] = playerInfos;

                const { lobbyId, player: { name } } = playerInfos;

                LobbyService.removePlayer(lobbyId, name);

                LobbyService.messagePlayerConnectionState("leavingPlayer", lobbyId, name);
            }
        });
    }

    private static async declare(socket: COUPSocket) {
        const userAgent = socket.handshake.headers["user-agent"];
        const auth = socket.handshake.auth;

        if (
            auth.sessionCode !== undefined
            &&
            PlayerService.reconnectionPlayers[auth.sessionCode] !== undefined
            &&
            PlayerService.reconnectionPlayers[auth.sessionCode].userAgent
                === userAgent
        ) {
            PlayerService.players[socket.id] = {
                socket: socket,
                sessionCode: auth.sessionCode,
                ...PlayerService.reconnectionPlayers[auth.sessionCode]
            }

            LobbyService.addPlayer(
                PlayerService.reconnectionPlayers[auth.sessionCode].lobbyId,
                PlayerService.reconnectionPlayers[auth.sessionCode].player.name,
                socket
            );

            delete PlayerService.reconnectionPlayers[auth.sessionCode];
        }

        try {
            const isLogged = auth.token !== undefined;

            const name = isLogged ?
                await UserService.getName(auth.token)
                :
                auth.name;

            const newPlayer = new Player(name);

            let lobbyId: number | undefined = auth.lobby;

            if (lobbyId === undefined)
                lobbyId = LobbyService.enterNewLobby(newPlayer);
            else
                LobbyService.enterLobby(newPlayer, lobbyId);

            PlayerService.players[socket.id] = {
                socket: socket,
                lobbyId: lobbyId,
                isLogged: isLogged,
                player: newPlayer,
                userAgent: userAgent,
                sessionCode: `${name}${socket.id}${userAgent}${Math.random()}`
            }

            socket.emit("sessionCode", PlayerService.players[socket.id].sessionCode);
        } catch (error) {
            socket.emit("disconnectReason", (error as Error).message);
            socket.disconnect();
        }
    }

    static getPlayer(socketId: string): Player {
        return PlayerService.players[socketId].player;
    }

    static getPlayerByName(name: string, lobbyId: number): Player | undefined {
        return Object.values(PlayerService.players)
            .find(player => player.lobbyId === lobbyId && player.player.name === name)?.player;
    }

    static getPlayersLobby(socketId: string): Lobby {
        const player = PlayerService.players[socketId];

        return LobbyService.getLobby(player.lobbyId) as Lobby;
    }

    static deletePlayer(socketId: string, disconnectReason: string) {
        const player = PlayerService.players[socketId];

        player.socket.emit("disconnectReason", disconnectReason);

        player.socket.disconnect();

        delete PlayerService.players[socketId];

        LobbyService.deletePlayer(player.lobbyId, player.player);
    }

    static deletePlayerByName(lobbyId: number, name: string, disconnectReason: string) {
        const playerInfos = Object.entries(PlayerService.players)
            .find(
                ([, { player, lobbyId: playerLobbyId }]) =>
                    lobbyId === playerLobbyId && player.name === name
            );

        if (playerInfos === undefined)
            return;

        PlayerService.deletePlayer(playerInfos[0], disconnectReason);
    }
}