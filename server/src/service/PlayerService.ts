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
            lobbyID: lobbyID !== undefined ?
                lobbyID
                :
                LobbyService.enterNewLobby(newPlayer)
        };

        setTimeout(
            () => delete PlayerService.waitingPlayers[name],
            PlayerService.WAITING_TIMEOUT_MS
        );
    }

    static setListeners(socket: COUPSocket) {
        socket.on("disconnect", () => {
            LobbyService.deletePlayer(PlayerService.players[socket.id]);

            delete PlayerService.players[socket.id];
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

    static isPlayerLogedIn(socketID: string): boolean {
        return PlayerService.players[socketID].player !== null;
    }

    static getPlayer(socketID: string): Player | null {
        return PlayerService.players[socketID].player;
    }

    static getPlayersLobby(socketID: string): Lobby | null {
        const player = PlayerService.players[socketID];

        if (player === undefined)
            return null;

        return LobbyService.getLobby(player.lobbyID);
    }

    static setPlayersLobby(socketID: string, lobbyID: number) {
        PlayerService.players[socketID].lobbyID = lobbyID;
    }

    static getPlayerByName(name: string | undefined): Player | null {
        return Object.values(PlayerService.players)
            .map(infos => infos.player)
            .find(player => player?.name === name) || null;
    }
}