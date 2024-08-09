import Player from "../entity/player";
import LobbyService from "./LobbyService";
import Lobby from "../entity/Lobby";
import { COUPSocket } from "../socket/socket";
import UserService from "./UserService";

export default class PlayerService {
    private static players: {
        [socketId: string]: {
            player: Player,
            lobbyID: number
        }
    } = {};

    private static waitingPlayers: {
        [name: string]: {
            player: Player,
            lobbyID: number
        }
    } = {};

    private static WAITING_TIMEOUT_MS = 300_000;

    static addWaitingPlayer(name: string, lobbyID?: number) {
        const newPlayer = new Player(name);

        PlayerService.waitingPlayers[name] = {
            player: newPlayer,
            lobbyID: lobbyID === undefined ?
                LobbyService.enterNewLobby(newPlayer)
                :
                LobbyService.enterLobby(newPlayer, lobbyID)
        };

        setTimeout(
            () => delete PlayerService.waitingPlayers[name],
            PlayerService.WAITING_TIMEOUT_MS
        );
    }

    static setListeners(socket: COUPSocket) {
        socket.on("disconnect", () => {
            PlayerService.removePlayer(socket.id);
        });

        PlayerService.declare(socket);
    }

    private static declare(socket: COUPSocket) {
        UserService.getName(socket.handshake.auth.token)
            .then(name => {
                PlayerService.players[socket.id] =
                    PlayerService.waitingPlayers[name as string];

                delete PlayerService.waitingPlayers[name as string];
            });
    }

    static getPlayer(socketID: string): Player {
        return PlayerService.players[socketID].player;
    }

    static getPlayersLobby(socketID: string): Lobby {
        const player = PlayerService.players[socketID];

        return LobbyService.getLobby(player.lobbyID);
    }

    static getPlayersLobbyByName(name: string): Lobby | undefined {
        const playerInfos = Object.values(PlayerService.players)
            .find(p => p.player.name === name);

        if (playerInfos === undefined)
            return undefined;

        return LobbyService.getLobby(playerInfos.lobbyID);
    }

    static getPlayerByName(name: string): Player | undefined {
        return Object.values(PlayerService.players)
            .map(infos => infos.player)
            .find(player => player.name === name);
    }

    static removePlayer(socketId: string): number {
        const player = PlayerService.players[socketId];

        delete PlayerService.players[socketId];

        return LobbyService.deletePlayer(player.lobbyID, player.player);
    }

    static removePlayerByName(name: string): number {
        const playerInfos = Object.entries(PlayerService.players)
            .find(([_, { player }]) => player.name === name);

        if (playerInfos === undefined)
            return -1;

        return PlayerService.removePlayer(playerInfos[0]);
    }
}