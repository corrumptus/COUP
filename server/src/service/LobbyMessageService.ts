import Lobby from "../entity/Lobby";
import { COUPSocket } from "../socket/socket";

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
}