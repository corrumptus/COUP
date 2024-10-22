import Lobby from "../entity/Lobby";
import { COUPSocket, ResponseSocketEmitEvents } from "../socket/socket";

export default class MessageService {
    private static lobbys: {
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

    static send(
        lobbyId: number,
        name: string | undefined,
        messageType: keyof ResponseSocketEmitEvents,
        ...messages: Parameters<ResponseSocketEmitEvents[typeof messageType]>
    ) {
        const lobby = MessageService.lobbys[lobbyId];

        if (lobby === undefined)
            return;

        if (name === undefined) {
            lobby.players
                .forEach(({ socket }) => socket.emit(messageType, ...messages));
            return;
        }

        const player = lobby.players.find(p => p.name === name);

        if (player === undefined)
            return;

        player.socket.emit(messageType, ...messages);
    }

    static sendDiscriminating<T extends keyof ResponseSocketEmitEvents>(
        lobbyId: number,
        name: string | undefined,
        messageType: T,
        messager: (socket: COUPSocket, name: string) =>
            Parameters<ResponseSocketEmitEvents[T]>
    ) {
        const lobby = MessageService.lobbys[lobbyId];

        if (lobby === undefined)
            return;

        if (name === undefined) {
            lobby.players
                .forEach(({ socket, name }) => socket.emit(messageType, ...messager(socket, name)));
            return;
        }

        const player = lobby.players.find(p => p.name === name);

        if (player === undefined)
            return;

        player.socket.emit(messageType, ...messager(player.socket, player.name));
    }

    static getLobby(lobbyId: number): Lobby | undefined {
        return MessageService.lobbys[lobbyId].lobby;
    }
}