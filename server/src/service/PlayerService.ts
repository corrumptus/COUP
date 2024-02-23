import Player from "../entity/player";
import LobbyService from "./LobbyService";
import Lobby from "../entity/Lobby";
import ModifiedSocket from "../utils/ModifiedSocket";

export default class PlayerService {
    private static players: {
        [socketId: string]:
        {
            player: Player | null,
            lobbyID: number
        }
    } = {};

    static setListeners(socket: ModifiedSocket) {
        socket.on("login", (name: string) => {
            const newPlayer = new Player(name);

            PlayerService.players[socket.id].player = newPlayer;
        });

        socket.on("disconnect", () => {
            LobbyService.deletePlayer(PlayerService.players[socket.id]);

            delete PlayerService.players[socket.id];
        });

        PlayerService.declare(socket);
    }

    private static declare(socket: ModifiedSocket) {
        PlayerService.players[socket.id] = { player: null, lobbyID: -1 };
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