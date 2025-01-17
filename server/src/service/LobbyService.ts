import type { COUPSocket } from "@socket/socket";
import GameService from "@services/GameService";
import LobbyMessageService from "@services/LobbyMessageService";
import PlayerService from "@services/PlayerService";
import Lobby from "@entitys/Lobby";
import type Player from "@entitys/player";
import COUPMatchBalancing from "@resources/COUPMatchBalancing.json";
import Config from "@utils/Config";

export default class LobbyService {
    private static lobbys: Lobby[] = [];
    private static emptyLobbys: number[] = [];

    static setListeners(socket: COUPSocket) {
        const lobby = PlayerService.getPlayersLobby(socket.id);

        const player = PlayerService.getPlayer(socket.id);

        LobbyService.declare(lobby.id, player.name, socket);

        socket.on("updateConfigs", (keys: string[], value: number | boolean) => {
            if (!lobby.isOwner(player))
                return;

            if (!LobbyService.isValidNewConfigs(lobby.getConfigs(), keys, value))
                return;

            lobby.updateConfigs(keys, value);

            LobbyMessageService.sendLobbyStateChanges(lobby.id, "configsUpdated", keys, value);
        });

        socket.on("newOwner", (name: string) => {
            if (PlayerService.getPlayerByName(name, lobby.id) === undefined)
                return;

            const otherPlayer = PlayerService.getPlayerByName(name, lobby.id) as Player;

            lobby.newOwner(otherPlayer);

            LobbyMessageService.sendLobbyStateChanges(lobby.id, "newOwner", name);
        });

        socket.on("removePlayer", (name: string) => {
            if (PlayerService.getPlayerByName(name, lobby.id) === undefined)
                return;

            PlayerService.deletePlayerByName(lobby.id, name, "Jogador removido pelo dono do jogo");
        });

        socket.on("changePassword", (password: string) => {
            if (!lobby.isOwner(player))
                return;

            lobby.newPassword(password);

            LobbyMessageService.sendLobbyStateChanges(lobby.id, "passwordUpdated", password);
        });

        socket.on("removePassword", () => {
            if (!lobby.isOwner(player))
                return;

            lobby.removePassword();

            LobbyMessageService.sendLobbyStateChanges(lobby.id, "passwordUpdated");
        });

        socket.on("beginMatch", () => {
            if (!lobby.isOwner(player))
                return;

            const error = GameService.beginMatch(lobby);

            if (error !== undefined)
                socket.emit("gameActionError", error);
        });
    }

    private static declare(lobbyId: number, playerName: string, socket: COUPSocket) {
        const lobbyHasGame = LobbyService.lobbyIsRunningGame(lobbyId);

        if (lobbyHasGame) {
            LobbyMessageService.newPlayer(lobbyId, playerName, socket);

            GameService.reconnectGameState(lobbyId, playerName);
        } else {
            LobbyMessageService.sendLobbyStateChanges(lobbyId, "newPlayer", playerName);

            LobbyMessageService.newPlayer(lobbyId, playerName, socket);

            LobbyMessageService.sendLobbyState(lobbyId, playerName);
        }
    }

    static enterLobby(player: Player, lobbyId: number): number {
        const lobby = LobbyService.lobbys[lobbyId];

        if (lobby === undefined)
            throw new Error("Lobby não encontrado");

        lobby.addPlayer(player);

        return lobbyId;
    }

    static enterNewLobby(player: Player): number {
        const lobbyId: number =
            LobbyService.emptyLobbys.length > 0 ?
                LobbyService.enterEmptyLobby(player)
                :
                LobbyService.createNewLobby(player);

        return lobbyId;
    }

    private static enterEmptyLobby(player: Player): number {
        const lobbyId = LobbyService.emptyLobbys.at(-1) as number;

        LobbyService.lobbys[lobbyId].addPlayer(player);

        LobbyService.emptyLobbys.pop();

        return lobbyId;
    }

    private static createNewLobby(player: Player): number {
        const newLobby: Lobby = new Lobby(LobbyService.lobbys.length, player);

        LobbyService.lobbys.push(newLobby);

        LobbyMessageService.newLobby(newLobby);

        return LobbyService.lobbys.length - 1;
    }

    static addPlayer(lobbyId: number, playerName: string, socket: COUPSocket) {
        const lobby = LobbyService.lobbys[lobbyId];

        if (lobby === undefined)
            return;

        if (lobby.isRunningGame)
            GameService.addPlayer(lobby.id, socket);
        else
            LobbyMessageService.sendLobbyStateChanges(lobbyId, "newPlayer", playerName);
    }

    static removePlayer(lobbyId: number, playerName: string) {
        const lobby = LobbyService.lobbys[lobbyId];

        if (lobby === undefined)
            return;

        const wasOwner = lobby.isOwnerName(playerName);

        LobbyService.removePlayerFromTheServer(lobby, playerName, false);

        LobbyService.sendDeletionChanges(lobby, playerName, wasOwner);

        LobbyService.removeLobbyIfEmpty(lobby);
    }

    static deletePlayer(lobbyId: number, playerName: string) {
        const lobby = LobbyService.lobbys[lobbyId];

        if (lobby === undefined)
            return;

        const wasOwner = lobby.isOwnerName(playerName);

        LobbyService.removePlayerFromTheServer(lobby, playerName, true);

        LobbyService.sendDeletionChanges(lobby, playerName, wasOwner);

        LobbyService.removeLobbyIfEmpty(lobby);
    }

    private static removePlayerFromTheServer(lobby: Lobby, playerName: string, deleteFromLobby: boolean) {
        lobby.deletePlayer(playerName, deleteFromLobby);

        LobbyMessageService.removePlayer(lobby.id, playerName);

        if (lobby.isRunningGame) {
            GameService.deletePlayer(lobby.id, playerName);
            return;
        }
    }

    private static sendDeletionChanges(lobby: Lobby, playerName: string, wasOwner: boolean) {
        LobbyMessageService.sendLobbyStateChanges(lobby.id, "leavingPlayer", playerName);

        if (wasOwner && !lobby.isEmpty)
            LobbyMessageService.sendLobbyStateChanges(
                lobby.id,
                "newOwner",
                (lobby.getOwner() as Player).name
            );
    }

    private static removeLobbyIfEmpty(lobby: Lobby) {
        if (!lobby.isEmpty)
            return;

        if (lobby.id === LobbyService.lobbys.length - 1) {
            LobbyService.lobbys.pop();

            LobbyMessageService.removeLobby(lobby.id);
        } else
            LobbyService.emptyLobbys.push(lobby.id);
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

    static getLobby(lobbyId: number): Lobby | undefined {
        return LobbyService.lobbys[lobbyId];
    }

    static isPasswordFromLobby(password: string | undefined, lobbyId: number): boolean {
        const lobby = LobbyService.lobbys[lobbyId];

        if (lobby === undefined)
            return false;

        return lobby.getPassword() === password;
    }

    static lobbyIsRunningGame(lobbyId: number): boolean {
        const lobby = LobbyService.lobbys[lobbyId];

        if (lobby === undefined)
            return false;

        return lobby.isRunningGame;
    }

    static finishMatch(lobby: Lobby) {
        LobbyMessageService.finishMatch(lobby.id);
    }

    static get allLobbys() {
        return LobbyService.lobbys
            .filter(lobby => !lobby.isEmpty && !lobby.isRunningGame)
            .map(lobby => lobby.toLobbyFinder());
    }
}