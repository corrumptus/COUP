import Lobby from "../entity/Lobby";
import { ResponseSocketEmitEvents, SocketEmitLobbyEvents } from "../socket/socket";
import Config from "../utils/Config";
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
    static sendLobbyState(lobbyId: number, playerName: string) {
        const lobby = LobbyMessageService.lobbys[lobbyId];

        if (lobby === undefined)
            return;

        const player = lobby.players.find(p => p.name === playerName);

        if (player === undefined)
            return;

        player.socket
            .emit(
                "playerConnected",
                LobbyMessageService.calculateLobbyState(lobby.lobby, playerName)
            );
    }

    private static calculateLobbyState(lobby: Lobby, playerName: string): LobbyState {
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