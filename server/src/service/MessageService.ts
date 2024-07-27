import Lobby from "../entity/Lobby";
import { COUPSocket } from "../socket/socket";

export default class MessageService {
    protected static lobbys: {
        [lobbyId: number]: {
            lobby: Lobby,
            players: { socket: COUPSocket, name: string }[]
        }
    } = {}

    static newLobby(lobby: Lobby) {
        if (lobby.id in this.lobbys)
            return;

        MessageService.lobbys[lobby.id] = {
            lobby: lobby,
            players: []
        }
    }

    static removeLobby(lobbyId: number) {
        delete this.lobbys[lobbyId];
    }

    static newPlayer(lobbyId: number, name: string, socket: COUPSocket) {
        if (!(lobbyId in MessageService.lobbys))
            return;

        MessageService.lobbys[lobbyId].players.push({ socket: socket, name: name });
    }

    static removePlayer(lobbyId: number, name: string) {
        if (!(lobbyId in this.lobbys))
            return;

        const playerIndex = this.lobbys[lobbyId].players.findIndex(p => p.name === name);

        if (playerIndex === -1)
            return;

        this.lobbys[lobbyId].players.splice(playerIndex, 1);
    }
}