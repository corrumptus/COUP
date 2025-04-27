import type { COUPSocket } from "@socket/socket";
import GameService from "@services/GameService";
import MessageService from "@services/MessageService";
import SocketConnectionService from "@services/SocketConnectionService";
import SocketStoreService from "@services/SocketStoreService";
import Lobby from "@entitys/Lobby";
import type Player from "@entitys/player";
import COUPMatchBalancing from "@resources/COUPMatchBalancing.json";
import Config from "@utils/Config";
import LobbyStateCalculator from "@utils/LobbyStateCalculator";

export default class LobbyService {
    static setListeners(socket: COUPSocket) {
        socket.on("updateConfigs", (keys: string[], value: number | boolean) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isOwner(socket.data.player))
                return;

            if (!LobbyService.isValidNewConfigs(lobby.getConfigs(), keys, value))
                return;

            lobby.updateConfigs(keys, value);

            MessageService.sendToLobby(lobby.id, [ "configsUpdated", keys, value ]);
        });

        socket.on("newOwner", (name: string) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isOwner(socket.data.player))
                return;

            const otherSocket = SocketStoreService.getSocketInLobbyByName(socket.data.lobbyId, name);

            if (otherSocket === undefined)
                return;

            lobby.newOwner(otherSocket.data.player);

            MessageService.sendToLobby(lobby.id, [ "newOwner", name ]);
        });

        socket.on("removePlayer", (name: string) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isOwner(socket.data.player))
                return;

            const otherSocket = SocketStoreService.getSocketInLobbyByName(lobby.id, name);

            if (otherSocket === undefined)
                return;

            SocketConnectionService.deleteSocket(otherSocket, false, "Jogador removido pelo dono do jogo");
        });

        socket.on("changePassword", (password: string) => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isOwner(socket.data.player))
                return;

            lobby.newPassword(password);

            MessageService.sendToLobby(lobby.id, [ "passwordUpdated", password ]);
        });

        socket.on("removePassword", () => {
            const lobby = SocketStoreService.getLobby(socket.data.lobbyId);

            if (lobby === undefined)
                return;

            if (!lobby.isOwner(socket.data.player))
                return;

            lobby.removePassword();

            MessageService.sendToLobby(lobby.id, [ "passwordUpdated", undefined ]);
        });
    }

    static setLobbyId(socket: COUPSocket, lobbyId: Lobby["id"] | undefined) {
        const isNewLobby = lobbyId === undefined;

        if (lobbyId === undefined)
            lobbyId = SocketStoreService.newLobby(socket);

        socket.data.lobbyId = lobbyId;

        const lobby = SocketStoreService.getLobby(lobbyId) as Lobby;

        if (!isNewLobby)
            lobby.addPlayer(socket.data.player);

        MessageService.newSocket(socket);

        LobbyService.messageNewPlayer(lobby, socket);
    }

    private static messageNewPlayer(lobby: Lobby, socket: COUPSocket) {
        if (LobbyService.isRunningGame(lobby.id)) {
            GameService.reconnectGameState(lobby, socket.data.player);
            return;
        }

        const newPlayerName = socket.data.player.name;

        MessageService.sendToLobbyExcludingPlayer(
            lobby.id,
            newPlayerName,
            [ "newPlayer", newPlayerName ]
        );

        MessageService.sendToPlayerInLobby(
            lobby.id,
            newPlayerName,
            [ "playerConnected", new LobbyStateCalculator(lobby, newPlayerName).calculate() ]
        );
    }

    static isRunningGame(lobbyId: Lobby["id"]): boolean {
        const lobby = SocketStoreService.getLobby(lobbyId);

        if (lobby === undefined)
            return false;
        
        return lobby.isRunningGame;
    }

    static reconnectPlayer(socket: COUPSocket, lobbyId: Lobby["id"]) {
        socket.data.lobbyId = lobbyId;

        SocketStoreService.addSocket(socket);

        GameService.addPlayer(socket);
    }

    static removePlayer(lobbyId: Lobby["id"], player: Player) {
        const lobby = SocketStoreService.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        const wasOwner = lobby.isOwner(player);

        lobby.removePlayer(player);

        if (lobby.isRunningGame) {
            GameService.removePlayer(lobby, player);
            return;
        }

        MessageService.sendToLobby(lobby.id, [ "leavingPlayer", player.name ]);

        if (wasOwner)
            MessageService.sendToLobby(
                lobby.id,
                [ "newOwner", lobby.getOwner().name ]
            );
    }

    private static isValidNewConfigs(configs: Config, keys: string[], value: number | boolean): boolean {
        let config: any = COUPMatchBalancing;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in config))
                return false;

            config = config[keys[i]];
        }

        const validations: {
            type: string,
            minValue?: number,
            maxValue?: number,
            minByOperation?: {
                reference: string[],
                operation: "add" | "subtract" | "multiply" | "divide",
                operand: number
            }
        } = config[keys[keys.length - 1]];

        if (typeof value !== validations.type)
            return false;

        if (validations["minValue"] !== undefined && (value as number) < validations.minValue)
            return false;

        if (validations["maxValue"] !== undefined && (value as number) > validations.maxValue)
            return false;

        if (validations["minByOperation"] !== undefined) {
            config = configs;

            for (let i = 0; i < validations.minByOperation.reference.length; i++)
                config = config[validations.minByOperation.reference[i]];

            if (validations.minByOperation.operation === "add") 
                if ((value as number) < config + validations.minByOperation.operand)
                    return false;

            if (validations.minByOperation.operation === "subtract") 
                if ((value as number) < config - validations.minByOperation.operand)
                    return false;

            if (validations.minByOperation.operation === "multiply") 
                if ((value as number) < config * validations.minByOperation.operand)
                    return false;

            if (validations.minByOperation.operation === "divide") 
                if ((value as number) < config / validations.minByOperation.operand)
                    return false;
        }

        return true;
    }

    static hasPasswordInLobby(lobbyId: Lobby["id"]): boolean {
        const lobby = SocketStoreService.getLobby(lobbyId);

        if (lobby === undefined)
            return false;

        return lobby.hasPassword();
    }

    static isLobbyPassword(lobbyId: Lobby["id"], password: string | undefined): boolean {
        const lobby = SocketStoreService.getLobby(lobbyId);

        if (lobby === undefined)
            return false;

        if (!lobby.hasPassword())
            return password === undefined;

        if (password === undefined)
            return false;

        return lobby.isLobbyPassword(password);
    }

    static finishMatch(lobby: Lobby) {
        MessageService.sendToLobbyDiscriminating(
            lobby.id,
            socket => [
                "playerConnected",
                new LobbyStateCalculator(lobby, socket.data.player.name).calculate()
            ]
        );
    }

    static removeListeners(socket: COUPSocket) {
        socket.removeAllListeners("updateConfigs");
        socket.removeAllListeners("newOwner");
        socket.removeAllListeners("removePlayer");
        socket.removeAllListeners("changePassword");
        socket.removeAllListeners("removePassword");
    }

    static get allLobbys() {
        return SocketStoreService.getAllLobbys()
            .filter(lobby => !lobby.isRunningGame)
            .map(lobby => lobby.toLobbyFinder());
    }
}