import PlayerService from "./PlayerService";
import Action from "../entity/Action";
import Game from "../entity/Game";
import { COUPSocket } from "../socket/socket";
import CardType from "../entity/CardType";
import Player from "../entity/player";

export default class GameService {
    static setListeners(socket: COUPSocket) {
        socket.on("renda", () => {
            GameService.makeAction(socket.id, Action.RENDA);
        });

        socket.on("ajudaExterna", () => {
            GameService.makeAction(socket.id, Action.AJUDA_EXTERNA);
        });

        socket.on("taxar", (card, selfCard) => {
            GameService.makeAction(socket.id, Action.TAXAR, card, selfCard);
        });

        socket.on("corrupcao", (card, selfCard) => {
            GameService.makeAction(socket.id, Action.CORRUPCAO, card, selfCard);
        });

        socket.on("extorquir", (card, selfCard, targetName) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(socket.id, Action.EXTORQUIR, card, selfCard, target);
        });

        socket.on("assassinar", (card, selfCard, targetName, targetCard) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(socket.id, Action.ASSASSINAR, card, selfCard, target, targetCard);
        });

        socket.on("investigar", (card, selfCard, targetName, targetCard) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(socket.id, Action.INVESTIGAR, card, selfCard, target, targetCard);
        });

        socket.on("golpeEstado", (targetName, targetCard) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(socket.id, Action.GOLPE_ESTADO, undefined, undefined, target, targetCard);
        });

        socket.on("trocarPropriaReligiao", () => {
            GameService.makeAction(socket.id, Action.TROCAR_PROPRIA_RELIGIAO);
        });

        socket.on("trocarReligiaoOutro", (targetName) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(socket.id, Action.TROCAR_RELIGIAO_OUTRO, undefined, undefined, target);
        });

        socket.on("trocar", (card, selfCard, targetName, targetCard) => {
            const target = PlayerService.getPlayerByName(targetName);

            if (target === null)
                return;

            GameService.makeAction(socket.id, Action.TROCAR, card, selfCard, target, targetCard);
        });

        socket.on("contestar", (card?, selfCard?) => {
            GameService.makeAction(socket.id, Action.CONTESTAR, card, selfCard);
        });

        socket.on("bloquear", (card?, selfCard?) => {
            GameService.makeAction(socket.id, Action.BLOQUEAR, card, selfCard);
        });

        socket.on("continuar", () => {
            GameService.makeAction(socket.id, Action.CONTINUAR);
        });
    }

    static makeAction(
        socketId: string,
        action: Action,
        card?: CardType,
        selfCard?: number,
        target?: Player,
        targetCard?: number
    ) {
        const game = GameService.getPlayersGame(socketId);

        if (game === null)
            return;

        const player = PlayerService.getPlayer(socketId);

        game.getTurn(player)?.addAction(action);
    }

    static getPlayersGame(socketId: string): Game | null {
        const lobby = PlayerService.getPlayersLobby(socketId);

        if (lobby === null)
            return null;

        return lobby.getGame();
    }
}