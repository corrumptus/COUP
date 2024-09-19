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

        LobbyMessageService.newPlayer(lobby.id, player.name, socket);

        socket.on("updateConfigs", (keys: string[], value: number | boolean) => {
            if (!lobby.isOwner(player))
                return;

            lobby.updateConfigs(keys, value);

            LobbyMessageService.sendLobbyStateChanges(lobby.id, "configsUpdated", keys, value);
        });

        socket.on("newOwner", (name: string) => {
            const newOwnerLobby = PlayerService.getPlayersLobbyByName(name);

            if (lobby !== newOwnerLobby)
                return;

            const otherPlayer = PlayerService.getPlayerByName(name) as Player;

            lobby.newOwner(otherPlayer);

            LobbyMessageService.sendLobbyStateChanges(lobby.id, "newOwner", name);
        });

        socket.on("removePlayer", (name: string) => {
            const removedPlayersLobby = PlayerService.getPlayersLobbyByName(name);

            if (lobby !== removedPlayersLobby)
                return;

            PlayerService.removePlayerByName(name, "Jogador removido pelo dono do jogo");

            LobbyMessageService.sendLobbyStateChanges(lobby.id, "leavingPlayer", name);
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

    static enterLobby(player: Player, lobbyId: number): number {
        const lobby = LobbyService.lobbys[lobbyId];

        if (lobby === undefined)
            throw new Error("Lobby not found");

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

    static messagePlayerDisconnected(lobbyId: number, name: string) {
        LobbyMessageService.sendLobbyStateChanges(lobbyId, "leavingPlayer", name);
    }

    static deletePlayer(lobbyId: number, player: Player) {
        const lobby = LobbyService.lobbys[lobbyId];

        if (lobby === undefined)
            return;

        lobby.removePlayer(player);

        LobbyMessageService.removePlayer(lobby.id, player.name);

        if (lobby.isEmpty) {
            if (lobbyId === LobbyService.lobbys.length - 1) {
                LobbyService.lobbys.pop();

                LobbyMessageService.removeLobby(lobbyId);
            } else
                LobbyService.emptyLobbys.push(lobbyId);
        }
    }

    static getLobby(lobbyId: number): Lobby {
        const lobby = LobbyService.lobbys[lobbyId];

        return lobby;
    }

    static isPasswordFromLobby(password: string | undefined, lobbyId: number): boolean {
        const lobby = LobbyService.lobbys[lobbyId];

        if (lobby === undefined)
            return false;

        return lobby.getPassword() === password;
    }

    static get allLobbys() {
        return LobbyService.lobbys
            .filter(lobby => !lobby.isEmpty && !lobby.isRunningGame)
            .map(lobby => lobby.toLobbyFinder());
    }
}