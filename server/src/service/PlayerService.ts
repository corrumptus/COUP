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
            isLogged: boolean
        }
    } = {};

    private static waitingPlayers: {
        [name: string]: {
            player: Player,
            lobbyId: number,
            isLogged: boolean
        }
    } = {};

    private static WAITING_TIMEOUT_MS = 300_000;

    static addWaitingPlayer(name: string, isLogged: boolean, lobbyId?: number): number {
        const newPlayer = new Player(name);

        PlayerService.waitingPlayers[name] = {
            player: newPlayer,
            lobbyId: lobbyId === undefined ?
                LobbyService.enterNewLobby(newPlayer)
                :
                LobbyService.enterLobby(newPlayer, lobbyId),
            isLogged: isLogged
        };

        setTimeout(
            () => {
                const { lobbyId, player } = PlayerService.waitingPlayers[name];

                LobbyService.deletePlayer(lobbyId, player);
                delete PlayerService.waitingPlayers[name];
            },
            PlayerService.WAITING_TIMEOUT_MS
        );

        return PlayerService.waitingPlayers[name].lobbyId;
    }

    static setListeners(socket: COUPSocket) {
        socket.on("disconnect", () => {
            PlayerService.removePlayer(socket.id);
        });

        PlayerService.declare(socket);
    }

    private static async declare(socket: COUPSocket) {
        if (socket.handshake.auth.token !== undefined) {
            const name = await UserService.getName(socket.handshake.auth.token);

            PlayerService.players[socket.id] =
                PlayerService.waitingPlayers[name as string];

            delete PlayerService.waitingPlayers[name as string];
        } else {
            const name = socket.handshake.auth.name;

            PlayerService.players[socket.id] =
                PlayerService.waitingPlayers[name];

            delete PlayerService.waitingPlayers[name];
        }
    }

    static getPlayer(socketID: string): Player {
        return PlayerService.players[socketID].player;
    }

    static getPlayersLobby(socketID: string): Lobby {
        const player = PlayerService.players[socketID];

        return LobbyService.getLobby(player.lobbyId);
    }

    static getPlayersLobbyByName(name: string): Lobby | undefined {
        const playerInfos = Object.values(PlayerService.players)
            .find(p => p.player.name === name);

        if (playerInfos === undefined)
            return undefined;

        return LobbyService.getLobby(playerInfos.lobbyId);
    }

    static getPlayerByName(name: string): Player | undefined {
        return Object.values(PlayerService.players)
            .map(infos => infos.player)
            .find(player => player.name === name);
    }

    static removePlayer(socketId: string): number {
        const player = PlayerService.players[socketId];

        delete PlayerService.players[socketId];

        return LobbyService.deletePlayer(player.lobbyId, player.player);
    }

    static removePlayerByName(name: string): number {
        const playerInfos = Object.entries(PlayerService.players)
            .find(([_, { player }]) => player.name === name);

        if (playerInfos === undefined)
            return -1;

        return PlayerService.removePlayer(playerInfos[0]);
    }
}