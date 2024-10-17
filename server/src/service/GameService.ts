import PlayerService from "./PlayerService";
import Action from "../entity/Action";
import Game from "../entity/Game";
import { COUPSocket } from "../socket/socket";
import ActionService from "./ActionService";
import GameMessageService from "./GameMessageService";
import LobbyService from "./LobbyService";

export default class GameService {
    static setListeners(socket: COUPSocket) {
        const lobbyId = PlayerService.getPlayersLobby(socket.id).id;

        socket.on("renda", () => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.RENDA);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("ajudaExterna", () => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.AJUDA_EXTERNA);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("taxar", (card, selfCard) => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.TAXAR, card, selfCard);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("corrupcao", (card, selfCard) => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.CORRUPCAO, card, selfCard);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("extorquir", (card, selfCard, target) => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.EXTORQUIR, card, selfCard, target);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("assassinar", (card, selfCard, target, targetCard) => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.ASSASSINAR, card, selfCard, target, targetCard);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("investigar", (card, selfCard, target, targetCard) => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.INVESTIGAR, card, selfCard, target, targetCard);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("golpeEstado", (target, targetCard) => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.GOLPE_ESTADO, undefined, undefined, target, targetCard);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("trocarPropriaReligiao", () => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.TROCAR_PROPRIA_RELIGIAO);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("trocarReligiaoOutro", (target) => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.TROCAR_RELIGIAO_OUTRO, undefined, undefined, target);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("trocar", (card, selfCard, target, targetCard) => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.TROCAR, card, selfCard, target, targetCard);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("contestar", (selfCard) => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.CONTESTAR, undefined, selfCard);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("bloquear", (card, selfCard) => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.BLOQUEAR, card, selfCard);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });

        socket.on("continuar", () => {
            try {
                const actionInfos = ActionService.makeAction(socket.id, Action.CONTINUAR);

                const game = GameService.getPlayersGame(socket.id) as Game;

                GameMessageService.updatePlayers(lobbyId, game, actionInfos);
            } catch (error) {
                socket.emit("gameActionError", (error as Error).message);
            }
        });
    }

    static getPlayersGame(socketId: string): Game | undefined {
        const lobby = PlayerService.getPlayersLobby(socketId);

        return lobby.getGame();
    }

    static beginMatch(lobbyId: number) {
        GameMessageService.beginMatch(lobbyId);
    }

    static addPlayer(lobbyId: number, socket: COUPSocket) {
        const lobby = LobbyService.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        const playerInfos = PlayerService.getPlayer(socket.id).toEnemyInfo();

        GameMessageService.sendPlayerReconnecting(lobbyId, playerInfos);
    }

    static removePlayer(lobbyId: number, playerName: string) {
        const lobby = LobbyService.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        GameMessageService.sendPlayerDisconnecting(lobbyId, playerName);
    }

    static deletePlayer(lobbyId: number, playerName: string) {
        const lobby = LobbyService.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        GameMessageService.sendPlayerDisconnecting(lobbyId, playerName);
    }
}