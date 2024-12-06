import { ResponseSocketEmitEvents, SocketEmitLobbyEvents } from "@socket/socket";
import MessageService from "@services/MessageService";
import Lobby from "@entitys/Lobby";
import Config from "@utils/Config";

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
        const lobby = super.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        super.send(
            lobbyId,
            playerName,
            "playerConnected",
            LobbyMessageService.calculateLobbyState(lobby, playerName)
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
        if (super.getLobby(lobbyId) === undefined)
            return;

        super.send(
            lobbyId,
            undefined,
            message,
            ...values
        );
    }
}