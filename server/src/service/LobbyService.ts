import Lobby from "../entity/Lobby";
import Player from "../entity/player";
import { COUPSocket } from "../socket/socket";
import GameService from "./GameService";
import LobbyMessageService from "./LobbyMessageService";
import PlayerService from "./PlayerService";

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

            lobby.newGame();

            GameService.beginMatch(lobby.id);
        });
    }

    private static declare(lobbyId: number, playerName: string, socket: COUPSocket) {
        const gameAlreadyStarted = LobbyService.lobbyIsRunningGame(lobbyId);

        if (!gameAlreadyStarted)
            LobbyMessageService.sendLobbyStateChanges(lobbyId, "newPlayer", playerName);

        LobbyMessageService.newPlayer(lobbyId, playerName, socket);

        if (!gameAlreadyStarted)
            LobbyMessageService.sendLobbyState(lobbyId, playerName);
        else
            GameService.reconnectGameState(lobbyId, playerName);
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

        lobby.removePlayer(playerName);

        LobbyMessageService.removePlayer(lobby.id, playerName);

        if (lobby.isRunningGame) {
            GameService.deletePlayer(lobby.id, playerName);
            return;
        }

        LobbyMessageService.sendLobbyStateChanges(lobbyId, "leavingPlayer", playerName);

        if (wasOwner)
            LobbyMessageService.sendLobbyStateChanges(
                lobbyId,
                "newOwner",
                (lobby.getOwner() as Player).name
            );

        if (!lobby.isEmpty)
            return;

        if (lobbyId === LobbyService.lobbys.length - 1) {
            LobbyService.lobbys.pop();

            LobbyMessageService.removeLobby(lobbyId);
        } else
            LobbyService.emptyLobbys.push(lobbyId);
    }

    static deletePlayer(lobbyId: number, player: Player) {
        const lobby = LobbyService.lobbys[lobbyId];

        if (lobby === undefined)
            return;

        LobbyMessageService.removePlayer(lobby.id, player.name);

        const wasOwner = lobby.isOwnerName(player.name);

        lobby.deletePlayer(player.name);

        if (lobby.isRunningGame) {
            GameService.deletePlayer(lobby.id, player.name);
            return;
        }

        LobbyMessageService.sendLobbyStateChanges(lobbyId, "leavingPlayer", player.name);

        if (wasOwner)
            LobbyMessageService.sendLobbyStateChanges(
                lobbyId,
                "newOwner",
                (lobby.getOwner() as Player).name
            );

        if (!lobby.isEmpty)
            return;

        if (lobbyId === LobbyService.lobbys.length - 1) {
            LobbyService.lobbys.pop();

            LobbyMessageService.removeLobby(lobbyId);
        } else
            LobbyService.emptyLobbys.push(lobbyId);
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

    static get allLobbys() {
        return LobbyService.lobbys
            .filter(lobby => !lobby.isEmpty && !lobby.isRunningGame)
            .map(lobby => lobby.toLobbyFinder());
    }
}