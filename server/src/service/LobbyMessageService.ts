import Lobby from "../entity/Lobby";
import { COUPSocket, ResponseSocketEmitEvents } from "../socket/socket";
import Config from "../utils/Config";
import LobbyService from "./LobbyService";

export type LobbyState = {
    player: {
      name: string
    },
    lobby: {
      players: string[],
      owner: string,
      configs: Config
    }
  }

export default class LobbyMessageService {
    private static lobbys: {
        [lobbyId: number]: {
            lobby: Lobby,
            players: { socket: COUPSocket, name: string }[]
        }
    } = {}

    static newLobby(lobby: Lobby) {
        if (lobby.id in this.lobbys)
            return;

        LobbyMessageService.lobbys[lobby.id] = {
            lobby: lobby,
            players: []
        }
    }

    static removeLobby(lobbyId: number) {
        delete this.lobbys[lobbyId];
    }

    static newPlayer(lobbyId: number, name: string, socket: COUPSocket) {
        if (!(lobbyId in this.lobbys))
            return;

        this.lobbys[lobbyId].players.push({ socket: socket, name: name });

        socket.emit("playerConnected", LobbyMessageService.calculateLobbyState(lobbyId, name));
    }

    private static calculateLobbyState(lobbyId: number, playerName: string): LobbyState {
        const lobby = LobbyService.getLobby(lobbyId);

        const lobbyState = lobby.getState();

        return {
            player: {
                name: playerName
            },
            lobby: lobbyState
        }
    }

    static removePlayer(lobbyId: number, name: string) {
        if (!(lobbyId in this.lobbys))
            return;

        const playerIndex = this.lobbys[lobbyId].players.findIndex(p => p.name === name);

        if (playerIndex === -1)
            return;

        this.lobbys[lobbyId].players.splice(playerIndex, 1);
    }

    static sendLobbyStateChanges<T extends keyof ResponseSocketEmitEvents>(
        lobbyId: number,
        message: T,
        ...values: Parameters<ResponseSocketEmitEvents[T]>
    ) {
        const sockets = LobbyMessageService.lobbys[lobbyId].players.map(p => p.socket);

        sockets.forEach(s => s.emit(message, ...values));
    }
}