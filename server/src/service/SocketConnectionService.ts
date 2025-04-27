import type { DisconnectReason } from "socket.io";
import type { COUPSocket } from "@socket/socket";
import GameService from "@services/GameService";
import LobbyService from "@services/LobbyService";
import MessageService from "@services/MessageService";
import SocketStoreService from "@services/SocketStoreService";
import Player from "@entitys/player";
import type Lobby from "@entitys/Lobby";
import SocketValidator from "@validators/SocketValidator";

export default class SocketConnectionService {
    private static reconnectionPlayers: {
        [reconnectionCode: string]: {
            player: Player,
            lobbyId: Lobby["id"]
        } | undefined
    } = {};

    static connectSocket(socket: COUPSocket) {
        try {
            SocketValidator.validateConnectionData(socket.handshake.auth);

            SocketConnectionService.setSocketData(socket);

            LobbyService.setListeners(socket);

            GameService.setListeners(socket);

            SocketConnectionService.setSocketData(socket);
        } catch(error) {
            socket.emit("disconnectReason", (error as Error).message);
            socket.disconnect();
        }
    }

    static setListeners(socket: COUPSocket) {
        socket.on("disconnect", (reason: DisconnectReason) => {
            const canReconnect = [
                    "client namespace disconnect",
                    "server namespace disconnect",
                    "server shutting down"
                ].includes(reason)
                ||
                !LobbyService.isRunningGame(socket.data.lobbyId);

            SocketConnectionService.deleteSocket(socket, canReconnect, "player desconectado");
        });
    }

    private static async setSocketData(socket: COUPSocket) {
        const { 
            reconnectionCode,
            name,
            lobby
        } = socket.handshake.auth;

        if (reconnectionCode !== undefined) {
            SocketConnectionService.reconnectPlayer(socket, lobby, reconnectionCode);
            return;
        }

        socket.data.player = new Player(name);

        LobbyService.setLobbyId(socket, lobby);

        socket.data.reconnectionCode = SocketConnectionService.generateReconnectionCode();
    }

    static lobbyBeginMatch(lobbyId: Lobby["id"]) {
        MessageService.sendToLobbyDiscriminating(
            lobbyId,
            socket => [ "reconnectionCode", socket.data.reconnectionCode ]
        );
    }

    static reconnectionCodeExists(code: number): boolean {
        return SocketConnectionService.reconnectionPlayers[code] !== undefined;
    }

    static reconnectPlayer(socket: COUPSocket, lobbyId: Lobby["id"], reconnectionCode: number) {
        const reconnectionInfo = SocketConnectionService.reconnectionPlayers[reconnectionCode];

        if (reconnectionInfo === undefined)
            throw new Error("O código de reconexão não existe");

        if (reconnectionInfo.lobbyId !== lobbyId)
            throw new Error("Não é possível se reconectar a um lobby diferente");

        socket.data.player = reconnectionInfo.player;

        LobbyService.reconnectPlayer(socket, reconnectionInfo.lobbyId);

        delete SocketConnectionService.reconnectionPlayers[reconnectionCode];
    }

    static deleteSocket(socket: COUPSocket, reconnect: boolean, disconnectReason: string) {
        const { lobbyId, player, reconnectionCode } = socket.data;
        
        if (reconnect)
            SocketConnectionService.reconnectionPlayers[reconnectionCode] = {
                lobbyId: lobbyId,
                player: player
            };

        LobbyService.removePlayer(lobbyId, player);

        SocketConnectionService.removeListeners(socket);

        LobbyService.removeListeners(socket);

        GameService.removeListeners(socket);

        MessageService.sendToPlayerInLobby(lobbyId, player.name, [ "disconnectReason", disconnectReason ]);

        MessageService.removeListeners(socket);

        SocketStoreService.removeSocket(socket);

        socket.disconnect();
    }

    private static generateReconnectionCode(): number {
        const code = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;

        if (code === 0)
            return SocketConnectionService.generateReconnectionCode();

        return code;
    }

    static removeListeners(socket: COUPSocket) {
        socket.removeAllListeners("disconnect");
        socket.removeAllListeners("beginMatch");
    }
}