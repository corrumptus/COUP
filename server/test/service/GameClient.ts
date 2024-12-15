import type { Socket } from "socket.io";
import GameService from "@services/GameService";
import LobbyService from "@services/LobbyService";
import PlayerService from "@services/PlayerService";
import type { RequestSocketOnEvents } from "@socket/socket";
import type Action from "@entitys/Action";
import CardType, * as CardTypeModule from "@entitys/CardType";
import type Game from "@entitys/Game";
import type Lobby from "@entitys/Lobby";
import type Player from "@entitys/player";
import { createSocket, getSocketOnCB } from "@tests/utils";

export default class GameClient {
    private socket1: jest.Mocked<Socket>;
    private socket2: jest.Mocked<Socket>;
    private player1: Player;
    private player2: Player;
    private game: Game;

    private constructor(socket1: jest.Mocked<Socket>, socket2: jest.Mocked<Socket>) {
        this.socket1 = socket1;
        this.socket2 = socket2;

        this.player1 = PlayerService.getPlayer(socket1.id);
        this.player2 = PlayerService.getPlayer(socket2.id);

        this.game = (LobbyService.getLobby(0) as Lobby).getGame() as Game;

        this.clearMocks();
    }

    static async create<B extends boolean>(
        configs: [string[], number | boolean][],
        createAnotherPlayer: B,
        cards: B extends false ?
            [CardType, CardType, CardType, CardType, ...CardType[]]
            :
            [CardType, CardType, CardType, CardType, CardType, CardType, ...CardType[]]
    ) {
        const socket1 = createSocket(undefined);
        const socket2 = createSocket(0);

        await PlayerService.setListeners(socket1);
        LobbyService.setListeners(socket1);
        GameService.setListeners(socket1);

        getSocketOnCB(socket1, "canReceive")();

        await PlayerService.setListeners(socket2);
        LobbyService.setListeners(socket2);
        GameService.setListeners(socket2);

        getSocketOnCB(socket2, "canReceive")();

        configs.forEach(c => getSocketOnCB(socket1, "updateConfigs")(...c));

        if (createAnotherPlayer) {
            const socket3 = createSocket(0);

            await PlayerService.setListeners(socket3);
            LobbyService.setListeners(socket3);
            GameService.setListeners(socket3);

            getSocketOnCB(socket3, "canReceive")();
        }

        GameClient.createMockImplementations(cards);

        getSocketOnCB(socket1, "beginMatch")();

        return new this(socket1, socket2);
    }

    private static createMockImplementations(cards: CardType[]) {
        let i = 0;

        jest.spyOn(CardTypeModule, "randomCardType")
            .mockImplementation(() => cards[i++]);

        jest.spyOn(Math, "random").mockReturnValue(0);
    }

    getGame() {
        return this.game;
    }

    firstSocket() {
        return this.socket1;
    }

    firstPlayer() {
        return this.player1;
    }

    secondSocket() {
        return this.socket2;
    }

    secondPlayer() {
        return this.player2;
    }

    firstPlayerDo<T extends Action>(action: T, ...args: Parameters<RequestSocketOnEvents[T]>) {
        // @ts-ignore
        getSocketOnCB(this.socket1, action)(...args);
    }

    secondPlayerDo<T extends Action>(action: T, ...args: Parameters<RequestSocketOnEvents[T]>) {
        // @ts-ignore
        getSocketOnCB(this.socket2, action)(...args);
    }

    clearMocks() {
        this.socket1.emit.mockClear();
        this.socket2.emit.mockClear();
    }
}