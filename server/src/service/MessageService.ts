import type { COUPSocket, ResponseSocketEmitEvents } from "@socket/socket";
import Lobby from "@entitys/Lobby";
import Player from "@entitys/player";
import SocketStoreService from "./SocketStoreService";

type Message<T extends keyof ResponseSocketEmitEvents> = [T, ...Parameters<ResponseSocketEmitEvents[T]>];

export default class MessageService {
    private static messagesNotSent: {
        [socketId: COUPSocket["id"]]: Message<keyof ResponseSocketEmitEvents>[]
    } = {};

    static newSocket(socket: COUPSocket) {
        socket.data.canReceive = false;

        socket.on("canReceive", () => {
            socket.data.canReceive = true;

            if (MessageService.messagesNotSent[socket.id] === undefined)
                return;

            // @ts-ignore
            MessageService.messagesNotSent[socket.id].forEach(m => socket.emit(...m));

            delete MessageService.messagesNotSent[socket.id];
        });

        socket.on("cantReceive", () => {
            socket.data.canReceive = false;
        });
    }

    static removeListeners(socket: COUPSocket) {
        socket.removeAllListeners("canReceive");
        socket.removeAllListeners("cantReceive");

        delete MessageService.messagesNotSent[socket.id]
    }

    static sendToLobby<M extends keyof ResponseSocketEmitEvents>(
        lobbyId: Lobby["id"],
        message: Message<M>
    ) {
        const sockets = SocketStoreService.getLobbySockets(lobbyId);

        sockets.forEach(s => MessageService.emit(s, message));
    }

    static sendToPlayerInLobby<M extends keyof ResponseSocketEmitEvents>(
        lobbyId: Lobby["id"],
        name: Player["name"],
        message: Message<M>
    ) {
        const socket = SocketStoreService.getSocketInLobbyByName(lobbyId, name);

        if (socket === undefined)
            return;

        MessageService.emit(socket, message);
    }

    static sendToLobbyDiscriminating<M extends keyof ResponseSocketEmitEvents>(
        lobbyId: Lobby["id"],
        messager: (socket: COUPSocket) => Message<M>
    ) {
        const sockets = SocketStoreService.getLobbySockets(lobbyId);

        sockets.forEach(s => MessageService.emit(s, messager(s)));
    }

    static sendToPlayerInLobbyDiscriminating<M extends keyof ResponseSocketEmitEvents>(
        lobbyId: Lobby["id"],
        name: Player["name"],
        messager: (socket: COUPSocket) => Message<M>
    ) {
        const socket = SocketStoreService.getSocketInLobbyByName(lobbyId, name);

        if (socket === undefined)
            return;

        MessageService.emit(socket, messager(socket));
    }

    static sendToLobbyExcludingPlayer<M extends keyof ResponseSocketEmitEvents>(
        lobbyId: Lobby["id"],
        name: Player["name"],
        message: Message<M>
    ) {
        const sockets = SocketStoreService.getLobbySockets(lobbyId);

        sockets.forEach(s => s.data.player.name !== name && MessageService.emit(s, message));
    }

    private static emit<M extends keyof ResponseSocketEmitEvents>(
        socket: COUPSocket,
        message: Message<M>
    ) {
        if (socket.data.canReceive) {
            // @ts-ignore
            socket.emit(...message);
            return;
        }

        if (MessageService.messagesNotSent[socket.id] === undefined)
            MessageService.messagesNotSent[socket.id] = [];

        // @ts-ignore
        MessageService.messagesNotSent[socket.id].push(message);
    }
}