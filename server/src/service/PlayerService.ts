import { DisconnectReason } from "socket.io";
import { COUPSocket } from "@socket/socket";
import LobbyService from "@services/LobbyService";
import UserService from "@services/UserService";
import Player from "@entitys/player";
import Lobby from "@entitys/Lobby";

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
                ||
                !LobbyService.lobbyIsRunningGame(PlayerService.players[socket.id].lobbyId)
            )
                PlayerService.deletePlayer(socket.id, "player desconectou");
            else
                PlayerService.removePlayer(socket.id);
        });
    }

    private static async declare(socket: COUPSocket) {
        const { auth, headers: { ["user-agent"]: userAgent } } = socket.handshake;

        if (
            auth.sessionCode !== undefined
            &&
            PlayerService.reconnectionPlayers[auth.sessionCode] !== undefined
            &&
            PlayerService.reconnectionPlayers[auth.sessionCode].userAgent
                === userAgent
        ) {
            PlayerService.addPlayer(socket, auth.sessionCode);
            return;
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

    static getReconnectingPlayer(sessionCode: string):  {
        player: Player;
        lobbyId: number;
        isLogged: boolean;
        userAgent: string | undefined;
    } | undefined {
        return PlayerService.reconnectionPlayers[sessionCode];
    }

    static getPlayersLobby(socketId: string): Lobby {
        const { lobbyId } = PlayerService.players[socketId];

        return LobbyService.getLobby(lobbyId) as Lobby;
    }

    static addPlayer(socket: COUPSocket, sessionCode: string) {
        PlayerService.players[socket.id] = {
            socket: socket,
            sessionCode: sessionCode,
            ...PlayerService.reconnectionPlayers[sessionCode]
        }

        LobbyService.addPlayer(
            PlayerService.reconnectionPlayers[sessionCode].lobbyId,
            PlayerService.reconnectionPlayers[sessionCode].player.name,
            socket
        );

        delete PlayerService.reconnectionPlayers[sessionCode];
    }

    static removePlayer(socketId: string) {
        const { sessionCode, socket: _, ...playerInfos } = PlayerService.players[socketId];

        delete PlayerService.players[socketId];

        PlayerService.reconnectionPlayers[sessionCode] = playerInfos;

        LobbyService.removePlayer(playerInfos.lobbyId, playerInfos.player.name);
    }

    static deletePlayer(socketId: string, disconnectReason: string) {
        const { socket, lobbyId, player } = PlayerService.players[socketId];

        socket.emit("disconnectReason", disconnectReason);

        socket.disconnect();

        delete PlayerService.players[socketId];

        LobbyService.deletePlayer(lobbyId, player);
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

    static getSessionCode(socketId: string) {
        return PlayerService.players[socketId].sessionCode;
    }
}