import type Lobby from "@entitys/Lobby";
import type Config from "@utils/Config";
import Player from "@entitys/player";

export type LobbyState = {
    playerName: Player["name"],
    lobby: {
        id: Lobby["id"],
        players: Player["name"][],
        owner: Player["name"],
        configs: Config
    }
}

export default class LobbyStateCalculator {
    private lobby: Lobby;
    private playerName: Player["name"];

    constructor(lobby: Lobby, playerName: Player["name"]) {
        this.lobby = lobby;
        this.playerName = playerName;
    }

    calculate(): LobbyState {
        const lobbyState = this.lobby.getState();

        return {
            playerName: this.playerName,
            lobby: lobbyState
        }
    }
}