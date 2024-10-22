import Lobby from "../entity/Lobby";
import { COUPSocket, ResponseSocketEmitEvents } from "../socket/socket";

export default class MessageService {
    private static lobbys: {
        [lobbyId: number]: {
            lobby: Lobby,
            players: {
                socket: COUPSocket,
                name: string,
                canReceive: boolean,
                messageBuffer: {
                    messageType: keyof ResponseSocketEmitEvents,
                    messages: Parameters<ResponseSocketEmitEvents[keyof ResponseSocketEmitEvents]>
                }[]
            }[]
        }
    } = {}

    static newLobby(lobby: Lobby) {
        if (lobby.id in MessageService.lobbys)
            return;

        MessageService.lobbys[lobby.id] = {
            lobby: lobby,
            players: []
        }
    }

    static removeLobby(lobbyId: number) {
        delete MessageService.lobbys[lobbyId];
    }

    static newPlayer(lobbyId: number, name: string, socket: COUPSocket) {
        if (!(lobbyId in MessageService.lobbys))
            return;

        MessageService.lobbys[lobbyId].players.push({
            socket: socket, 
            name: name,
            canReceive: false,
            messageBuffer: []
        });

        socket.on("canReceive", () => {
            const player = MessageService.lobbys[lobbyId]
                .players.find(p => p.socket === socket);

            if (player === undefined)
                return;

            player.canReceive = true;

            player.messageBuffer
                .forEach(m => player.socket.emit(
                    m.messageType,
                    ...m.messages
                ));

            player.messageBuffer.splice(0);
        });

        socket.on("cantReceive", () => {
            const player = MessageService.lobbys[lobbyId]
                .players.find(p => p.socket === socket);

            if (player !== undefined)
                player.canReceive = false;
        });
    }

    static removePlayer(lobbyId: number, name: string) {
        if (!(lobbyId in MessageService.lobbys))
            return;

        const playerIndex = MessageService.lobbys[lobbyId].players
            .findIndex(p => p.name === name);

        if (playerIndex === -1)
            return;

        MessageService.lobbys[lobbyId].players.splice(playerIndex, 1);
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
                .forEach(p => MessageService.emit(p, messageType, messages));
            return;
        }

        const player = lobby.players.find(p => p.name === name);

        if (player === undefined)
            return;

        player.socket.emit(messageType, ...messages);

        MessageService.emit(player, messageType, messages);
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
                .forEach(p => MessageService.emit(p, messageType, messager(p.socket, p.name)));
            return;
        }

        const player = lobby.players.find(p => p.name === name);

        if (player === undefined)
            return;

        MessageService.emit(player, messageType, messager(player.socket, player.name));
    }

    private static emit<T extends keyof ResponseSocketEmitEvents>(player: {
            socket: COUPSocket,
            canReceive: boolean,
            messageBuffer: {
                messageType: keyof ResponseSocketEmitEvents,
                messages: Parameters<ResponseSocketEmitEvents[keyof ResponseSocketEmitEvents]>
            }[]
        },
        messageType: T,
        messages: Parameters<ResponseSocketEmitEvents[T]>
    ) {
        if (player.canReceive) {
            player.socket.emit(messageType, ...messages);
            return;
        }

        player.messageBuffer.push({
            messageType: messageType,
            messages: messages
        });
    }

    static getLobby(lobbyId: number): Lobby | undefined {
        return MessageService.lobbys[lobbyId].lobby;
    }
}