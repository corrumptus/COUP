import { COUPSocket, ResponseSocketEmitEvents, SocketEmitLobbyEvents } from "../socket/socket";
import Config from "../utils/Config";
import LobbyService from "./LobbyService";
import MessageService from "./MessageService";

export type LobbyState = {
    player: {
        name: string
    },
    lobby: {
        id: number,
        players: string[],
        owner: string,
        configs: Config
    }
}

export default class LobbyMessageService extends MessageService {
    static newPlayer(lobbyId: number, name: string, socket: COUPSocket) {
        LobbyMessageService.sendLobbyStateChanges(lobbyId, "newPlayer", name);

        super.newPlayer(lobbyId, name, socket);

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

    static sendLobbyStateChanges<T extends SocketEmitLobbyEvents>(
        lobbyId: number,
        message: T,
        ...values: Parameters<ResponseSocketEmitEvents[T]>
    ) {
        if (super.lobbys[lobbyId] === undefined)
            return;

        const sockets = super.lobbys[lobbyId].players.map(p => p.socket);

        sockets.forEach(s => s.emit(message, ...values));
    }
}