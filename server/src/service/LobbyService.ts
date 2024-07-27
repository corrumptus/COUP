import Lobby from "../entity/Lobby";
import Player from "../entity/player";
import { COUPSocket } from "../socket/socket";
import LobbyMessageService from "./LobbyMessageService";
import PlayerService from "./PlayerService";

export default class LobbyService {
    private static lobbys: Lobby[] = [];
    private static emptyLobbys: number[] = [];

    static setListeners(socket: COUPSocket) {
        socket.on("updateConfigs", (keys: string[], value: number | boolean) => {
            const lobby = PlayerService.getPlayersLobby(socket.id);

            const player = PlayerService.getPlayer(socket.id);

            if (!lobby.isOwner(player))
                return;

            lobby.updateConfigs(keys, value);

            LobbyMessageService.sendLobbyStateChanges(lobby.id, "configsUpdated", keys, value);
        });

        socket.on("newOwner", (name: string) => {
            const lobby = PlayerService.getPlayersLobby(socket.id);

            const newOwnerLobby = PlayerService.getPlayersLobbyByName(name);

            if (lobby !== newOwnerLobby)
                return;

            const player = PlayerService.getPlayerByName(name) as Player;

            lobby.newOwner(player);

            LobbyMessageService.sendLobbyStateChanges(lobby.id, "newOwner", name);
        });

        socket.on("removePlayer", (name: string) => {
            const lobby = PlayerService.getPlayersLobby(socket.id);

            const removedPlayersLobby = PlayerService.getPlayersLobbyByName(name);

            if (lobby !== removedPlayersLobby)
                return;

            const index = PlayerService.removePlayerByName(name);

            LobbyMessageService.sendLobbyStateChanges(lobby.id, "leavingPlayer", index);
        });

        socket.on("beginMatch", () => {
            const lobby = PlayerService.getPlayersLobby(socket.id);

            const player = PlayerService.getPlayer(socket.id);

            if (!lobby.isOwner(player))
                return;

            lobby.newGame();
        });
    }

    static enterLobby(player: Player, lobbyID: number): number {
        const lobby = LobbyService.lobbys[lobbyID];

        if (lobby === undefined)
            throw new Error("Lobby not found");

        lobby.addPlayer(player);

        return lobbyID;
    }

    static enterNewLobby(player: Player): number {
        const lobbyID: number =
            LobbyService.emptyLobbys.length > 0 ?
                LobbyService.enterEmptyLobby(player)
                :
                LobbyService.createNewLobby(player);

        return lobbyID;
    }

    private static enterEmptyLobby(player: Player): number {
        const lobbyID = LobbyService.emptyLobbys.at(-1) as number;

        LobbyService.lobbys[lobbyID].addPlayer(player);

        LobbyService.emptyLobbys.pop();

        return lobbyID;
    }

    private static createNewLobby(player: Player): number {
        const newLobby: Lobby = new Lobby(LobbyService.lobbys.length, player);

        LobbyService.lobbys.push(newLobby);

        return LobbyService.lobbys.length - 1;
    }

    static deletePlayer({ player, lobbyID }: { player: Player | null, lobbyID: number }): number {
        const lobby = LobbyService.lobbys[lobbyID];

        if (lobby === undefined)
            return -1;

        LobbyService.handleLobbyDeleting(lobby.id);
        
        return lobby.removePlayer(player);
    }

    private static handleLobbyDeleting(lobbyID: number) {
        const lobby = LobbyService.lobbys[lobbyID];

        if (lobbyID === LobbyService.lobbys.length - 1 && lobby.isEmpty)
            LobbyService.lobbys.pop();

        if (lobby.isEmpty)
            LobbyService.emptyLobbys.push(lobbyID);
    }

    static getLobby(lobbyID: number): Lobby {
        const lobby = LobbyService.lobbys[lobbyID];

        return lobby;
    }

    static get allLobbys() {
        return LobbyService.lobbys
            .filter(lobby => !lobby.isEmpty)
            .map(lobby => lobby.toLobbyFinder());
    }
}