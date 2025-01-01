import type { COUPSocket } from "@socket/socket";
import ActionService from "@services/ActionService";
import GameMessageService from "@services/GameMessageService";
import LobbyService from "@services/LobbyService";
import PlayerService from "@services/PlayerService";
import Action from "@entitys/Action";
import type Game from "@entitys/Game";
import Lobby from "@entitys/Lobby";

export default class GameService {
    static setListeners(socket: COUPSocket) {
        const lobbyId = PlayerService.getPlayersLobby(socket.id).id;

        socket.on("renda", () =>
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.RENDA
            )
        );

        socket.on("ajudaExterna", () =>
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.AJUDA_EXTERNA
            )
        );

        socket.on("taxar", (card, selfCard) =>
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.TAXAR,
                card,
                selfCard
            )
        );

        socket.on("corrupcao", (card, selfCard) => 
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.CORRUPCAO,
                card,
                selfCard
            )
        );

        socket.on("extorquir", (card, selfCard, target) => 
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.EXTORQUIR,
                card, 
                selfCard,
                target
            )
        );

        socket.on("assassinar", (card, selfCard, target, targetCard) => 
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.ASSASSINAR,
                card,
                selfCard,
                target,
                targetCard
            )
        );

        socket.on("investigar", (card, selfCard, target, targetCard) => 
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.INVESTIGAR,
                card,
                selfCard,
                target,
                targetCard
            )
        );

        socket.on("golpeEstado", (target, targetCard) => 
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.GOLPE_ESTADO,
                undefined,
                undefined,
                target,
                targetCard
            )
        );

        socket.on("trocarPropriaReligiao", () => 
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.TROCAR_PROPRIA_RELIGIAO
            )
        );

        socket.on("trocarReligiaoOutro", (target) => GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.TROCAR_RELIGIAO_OUTRO,
                undefined,
                undefined,
                target
            )
        );

        socket.on("trocar", (card, selfCard, target, targetCard) => 
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.TROCAR,
                card,
                selfCard,
                target,
                targetCard
            )
        );

        socket.on("bloquear", (card, selfCard) => 
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.BLOQUEAR,
                card,
                selfCard
            )
        );

        socket.on("contestar", (selfCard) => 
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.CONTESTAR,
                undefined,
                selfCard
            )
        );

        socket.on("continuar", () => 
            GameService.socketEventHandler(
                lobbyId,
                socket,
                Action.CONTINUAR
            )
        );

        socket.on("finishMatch", () => {
            const lobby = PlayerService.getPlayersLobby(socket.id);
            const player = PlayerService.getPlayer(socket.id);

            if (!lobby.isOwner(player))
                return;

            LobbyService.finishMatch(lobby);
        });

        socket.on("restartMatch", () => {
            const lobby = PlayerService.getPlayersLobby(socket.id);
            const player = PlayerService.getPlayer(socket.id);

            if (!lobby.isOwner(player))
                return;

            if (lobby.getGame() !== undefined || !(lobby.getGame() as Game).isEnded)
                return;

            lobby.newGame();

            GameService.beginMatch(lobby);
        });
    }

    private static socketEventHandler(
        lobbyId: number,
        socket: COUPSocket,
        ...args: Parameters<typeof ActionService.makeAction> extends [infer _, ...args: infer P] ? P : any
    ) {
        try {
            const {
                actionInfos,
                turn
            } = ActionService.makeAction(socket.id, ...args);

            const game = GameService.getPlayersGame(socket.id) as Game;

            GameMessageService.updatePlayers(lobbyId, game, turn, actionInfos);
        } catch (error) {
            socket.emit("gameActionError", (error as Error).message);
        }
    }

    static getPlayersGame(socketId: string): Game | undefined {
        const lobby = PlayerService.getPlayersLobby(socketId);

        return lobby.getGame();
    }

    static beginMatch(lobby: Lobby): string | void {
        if (lobby.getState().players.length < 2)
            return "Um jogo só pode ser criado com mais de 1 pessoa";

        lobby.newGame();

        GameMessageService.beginMatch(lobby.id);
    }

    static addPlayer(lobbyId: number, socket: COUPSocket) {
        const lobby = LobbyService.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        const playerInfos = PlayerService.getPlayer(socket.id).toEnemyInfo();

        GameMessageService.sendPlayerReconnecting(lobbyId, playerInfos);
    }

    static reconnectGameState(lobbyId: number, playerName: string) {
        const lobby = LobbyService.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        GameMessageService.reconnectGameState(lobbyId, playerName);
    }

    static deletePlayer(lobbyId: number, playerName: string) {
        const lobby = LobbyService.getLobby(lobbyId);

        if (lobby === undefined)
            return;

        ActionService.revertTurn(lobbyId);

        GameMessageService.sendPlayerDisconnecting(lobbyId, playerName);
    }
}