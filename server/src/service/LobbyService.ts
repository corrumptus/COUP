import Lobby from "../entity/Lobby";
import Player from "../entity/player";
import PlayerService from "./PlayerService";
import ModifiedSocket from "../utils/ModifiedSocket";

export default class LobbyService {
    private static lobbys: Lobby[] = [];
    private static newLobbyID: number;
    private static emptyLobbys: number[] = [];

    static setListeners(socket: ModifiedSocket) {
        socket.on("createLobby", () => {
            const player = PlayerService.getPlayer(socket.id);

            if (player === null)
                return;

            const lobbyID: number = LobbyService.enterEmptyLobbyOrCreate(player);

            PlayerService.setPlayersLobby(socket.id, lobbyID);
        });

        socket.on("enterLobby", (lobbyID: number) => {
            const player = PlayerService.getPlayer(socket.id);

            if (player === null)
                return;

            const hasEntered: boolean = LobbyService.enterLobby(player, lobbyID);

            if (hasEntered)
                PlayerService.setPlayersLobby(socket.id, lobbyID);
        });

        socket.on("leaveLobby", (lobbyID: number) => {
            LobbyService.deletePlayer({
                player: PlayerService.getPlayer(socket.id),
                lobbyID: lobbyID 
            });
        });
    }

    private static enterEmptyLobbyOrCreate(player: Player): number {
        const lobbyID: number =
            LobbyService.emptyLobbys.length > 0 ?
                LobbyService.enterEmptyLobby(player)
                :
                LobbyService.createNewLobby(player);

        return lobbyID;
    }

    private static enterLobby(player: Player, lobbyID: number): boolean {
        const lobby = LobbyService.lobbys[lobbyID];

        if (lobby === undefined)
            return false;

        lobby.addPlayer(player);

        return true;
    }

    private static enterEmptyLobby(player: Player): number {
        const lobbyID = LobbyService.emptyLobbys.at(-1) as number;

        LobbyService.lobbys[lobbyID].addPlayer(player);

        LobbyService.emptyLobbys.pop();

        return lobbyID;
    }

    private static createNewLobby(player: Player): number {
        const lobbyID = LobbyService.newLobbyID++;

        const newLobby: Lobby = new Lobby(lobbyID, player);

        LobbyService.lobbys.push(newLobby);

        return lobbyID;
    }

    static deletePlayer({ player, lobbyID }: { player: Player | null, lobbyID: number }) {
        const lobby = LobbyService.lobbys[lobbyID];

        if (lobby === undefined)
            return;

        lobby.removePlayer(player);

        LobbyService.handleLobbyDeleting(lobby.id);
    }

    private static handleLobbyDeleting(lobbyID: number) {
        const lobby = LobbyService.lobbys[lobbyID];

        if (lobbyID === LobbyService.newLobbyID - 1 && lobby.isEmpty) {
            LobbyService.lobbys.pop();
            LobbyService.newLobbyID--;
        }

        if (lobby.isEmpty)
            LobbyService.emptyLobbys.push(lobbyID);
    }

    static getLobby(lobbyID: number): Lobby | null {
        const lobby = LobbyService.lobbys[lobbyID];

        if (lobby === undefined)
            return null;

        return lobby;
    }
}