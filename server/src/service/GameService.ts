import PlayerService from "./PlayerService";
import Action from "../entity/Action";
import Player from "../entity/player";
import Turn from "../entity/Turn";
import Game from "../entity/Game";
import { COUPSocket } from "../socket/socket";

export default class GameService {
    static setListeners(socket: COUPSocket) {
        socket.on("renda", () => {
            GameService.makeAction(Action.RENDA, socket.id);
        });

        socket.on("ajudaExterna", () => {
            GameService.makeAction(Action.AJUDA_EXTERNA, socket.id);
        });

        socket.on("taxar", (card, selfCard) => {
            GameService.makeAction(Action.TAXAR, socket.id);
        });

        socket.on("corrupcao", (card, selfCard) => {
            GameService.makeAction(Action.TAXAR, socket.id);
        });

        socket.on("extorquir", (card, selfCard, targetName) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(Action.EXTORQUIR, socket.id, target);
        });

        socket.on("assassinar", (card, selfCard, targetName, targetCard) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(Action.ASSASSINAR, socket.id, target);
        });

        socket.on("investigar", (card, selfCard, targetName, targetCard) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(Action.INVESTIGAR, socket.id, target);
        });

        socket.on("golpeEstado", (targetName, targetCard) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(Action.GOLPE_ESTADO, socket.id, target);
        });

        socket.on("trocarPropriaReligiao", () => {
            GameService.makeAction(Action.TROCAR_PROPRIA_RELIGIAO, socket.id);
        });

        socket.on("trocarReligiaoOutro", (targetName) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(Action.TROCAR_RELIGIAO_OUTRO, socket.id, target);
        });

        socket.on("trocar", (card, selfCard, targetName, targetCard) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(Action.TROCAR, socket.id, target);
        });

        socket.on("contestar", (card?, selfCard?) => {
            GameService.makeAction(Action.CONTESTAR, socket.id);
        });

        socket.on("bloquear", (card?, selfCard?) => {
            GameService.makeAction(Action.BLOQUEAR, socket.id);
        });

        socket.on("continuar", () => {
            GameService.makeAction(Action.CONTINUAR, socket.id);
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