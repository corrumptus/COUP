import { COUPSocket } from "@socket/socket";
import Lobby from "@entitys/Lobby";
import Player from "@entitys/player";

export default class SocketStoreService {
    private static lobbys: {
        [lobbyId: Lobby["id"]]: {
            lobby: Lobby,
            sockets: {
                [socketId: COUPSocket["id"]]: COUPSocket
            }
        } | undefined
    } = {};

    static getAllLobbys() {
        return Object.values(SocketStoreService.lobbys)
            .map(lobbyInfos => (lobbyInfos as { lobby: Lobby }).lobby);
    }

    static getLobby(lobbyId: Lobby["id"]): Lobby | undefined {
        return SocketStoreService.lobbys[lobbyId]?.lobby;
    }

    static newLobby(socket: COUPSocket): Lobby["id"] {
        const id = crypto.randomUUID();

        SocketStoreService.lobbys[id] = {
            lobby: new Lobby(id, socket.data.player),
            sockets: {
                [socket.id]: socket
            }
        };

        return id;
    }

    static getLobbySockets(lobbyId: Lobby["id"]): COUPSocket[] {
        const lobbyInfos = SocketStoreService.lobbys[lobbyId];

        if (lobbyInfos === undefined)
            return [];

        return Object.values(lobbyInfos.sockets);
    }

    static getSocketInLobby(lobbyId: Lobby["id"], socketId: COUPSocket["id"]): COUPSocket | undefined {
        const lobbyInfos = SocketStoreService.lobbys[lobbyId];

        if (lobbyInfos === undefined)
            return undefined;

        return lobbyInfos.sockets[socketId];
    }

    static getSocketInLobbyByName(lobbyId: Lobby["id"], name: Player["name"]): COUPSocket | undefined {
        const lobbyInfos = SocketStoreService.lobbys[lobbyId];

        if (lobbyInfos === undefined)
            return undefined;

        return Object.values(lobbyInfos.sockets).find(s => s.data.player.name === name);
    }

    static playerExists(lobbyId: Lobby["id"], name: Player["name"]): boolean {
        const lobbyInfo = SocketStoreService.lobbys[lobbyId];

        if (lobbyInfo === undefined)
            return false;

        return Object.values(lobbyInfo.sockets).find(s => s.data.player.name === name) !== undefined;
    }

    static addSocket(socket: COUPSocket) {
        const lobbyInfos = SocketStoreService.lobbys[socket.data.lobbyId];

        if (lobbyInfos === undefined)
            return;

        lobbyInfos.sockets[socket.id] = socket;
    }

    static removeSocket(socket: COUPSocket) {
        const lobbyInfos = SocketStoreService.lobbys[socket.data.lobbyId];

        if (lobbyInfos === undefined)
            return;

        delete lobbyInfos.sockets[socket.id];

        if (Object.values(lobbyInfos.sockets).length === 0)
            delete SocketStoreService.lobbys[socket.data.lobbyId];
    }
}