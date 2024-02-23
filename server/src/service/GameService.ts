import PlayerService from "./PlayerService";
import Action from "../entity/Action";
import Player from "../entity/player";
import Turn from "../entity/Turn";
import Game from "../entity/Game";
import Config from "../utils/Config";
import ModifiedSocket from "../utils/ModifiedSocket";

export default class GameService {
    static setListeners(socket: ModifiedSocket) {
        socket.on("initGame", (customConfigs?: Config) => {
            const lobby = PlayerService.getPlayersLobby(socket.id);

            if (lobby === null)
                return;

            lobby.newGame(customConfigs);
        });

        socket.on("renda", () => {
            GameService.makeAction(Action.RENDA, socket.id);
        });

        socket.on("ajudaExterna", () => {
            GameService.makeAction(Action.AJUDA_EXTERNA, socket.id);
        });

        socket.on("golpeEstado", (name: string) => {
            const target = PlayerService.getPlayerByName(name);

            if (target === null)
                return;

            GameService.makeAction(Action.GOLPE_ESTADO, socket.id, target);
        });

        socket.on("taxar", () => {
            GameService.makeAction(Action.TAXAR, socket.id);
        });

        socket.on("assassinar", (name: string) => {
            const target = PlayerService.getPlayerByName(name);

            if (target === null)
                return;

            GameService.makeAction(Action.ASSASSINAR, socket.id, target);
        });

        socket.on("extorquir", (name: string) => {
            const target = PlayerService.getPlayerByName(name);

            if (target === null)
                return;

            GameService.makeAction(Action.EXTORQUIR, socket.id, target);
        });

        socket.on("trocar", (name?: string) => {
            const target = PlayerService.getPlayerByName(name);

            if (target === null)
                return;

            GameService.makeAction(Action.TROCAR, socket.id, target);
        });

        socket.on("investigar", (name: string) => {
            const target = PlayerService.getPlayerByName(name);

            if (target === null)
                return;

            GameService.makeAction(Action.INVESTIGAR, socket.id, target);
        });

        socket.on("contestar", (name: string) => {
            const target = PlayerService.getPlayerByName(name);

            if (target === null)
                return;

            GameService.makeAction(Action.CONTESTAR, socket.id, target);
        });

        socket.on("bloquear", (name: string) => {
            const target = PlayerService.getPlayerByName(name);

            if (target === null)
                return;

            GameService.makeAction(Action.BLOQUEAR, socket.id, target);
        });
    }

    static makeAction(action: Action, socketID: string, target?: Player) {
        const turn = GameService.gatPlayersTurn(socketID);

        if (turn === null)
            return;

        turn.addAction(action, target);
    }

    static getPlayersGame(socketID: string): Game | null {
        const lobby = PlayerService.getPlayersLobby(socketID);

        if (lobby === null)
            return null;

        return lobby.getGame();
    }

    static gatPlayersTurn(socketID: string): Turn | null {
        const game = GameService.getPlayersGame(socketID);

        if (game === null)
            return null;

        return game.getTurn(PlayerService.getPlayer(socketID));
    }
}