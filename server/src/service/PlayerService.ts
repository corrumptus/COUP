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
            socket: COUPSocket
        }
    } = {};

    static async setListeners(socket: COUPSocket) {
        await PlayerService.declare(socket);

        socket.on("disconnect", () => {
            const { lobbyId, player: { name } } = PlayerService.players[socket.id];

            PlayerService.removePlayer(socket.id, "player desconectou");

            LobbyService.messagePlayerDisconnected(lobbyId, name);
        });
    }

    private static async declare(socket: COUPSocket) {
        try {
            const isLogged = socket.handshake.auth.token !== undefined;

            const name = isLogged ?
                await UserService.getName(socket.handshake.auth.token)
                :
                socket.handshake.auth.name;

            const newPlayer = new Player(name);

            let lobbyId: number = socket.handshake.auth.lobby;

            if (lobbyId === -1)
                lobbyId = LobbyService.enterNewLobby(newPlayer);
            else
                LobbyService.enterLobby(newPlayer, lobbyId);

            PlayerService.players[socket.id] = {
                socket: socket,
                lobbyId: lobbyId,
                isLogged: isLogged,
                player: newPlayer
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

    static getPlayersLobby(socketId: string): Lobby {
        const player = PlayerService.players[socketId];

        return LobbyService.getLobby(player.lobbyId);
    }

    static removePlayer(socketId: string, disconnectReason: string) {
        const player = PlayerService.players[socketId];

        player.socket.emit("disconnectReason", disconnectReason);

        player.socket.disconnect();

        delete PlayerService.players[socketId];

        LobbyService.deletePlayer(player.lobbyId, player.player);
    }

    static removePlayerByName(lobbyId: number, name: string, disconnectReason: string) {
        const playerInfos = Object.entries(PlayerService.players)
            .find(
                ([, { player, lobbyId: playerLobbyId }]) =>
                    lobbyId === playerLobbyId && player.name === name
            );

        if (playerInfos === undefined)
            return;

        PlayerService.removePlayer(playerInfos[0], disconnectReason);
    }
}