import { Socket } from "socket.io";
import GameService from "@services/GameService";
import LobbyService from "@services/LobbyService";
import PlayerService from "@services/PlayerService";
import { RequestSocketOnEvents } from "@socket/socket";
import Action from "@entitys/Action";
import CardType, * as CardTypeModule from "@entitys/CardType";
import Game from "@entitys/Game";
import Lobby from "@entitys/Lobby";
import Player from "@entitys/player";
import { createSocket, getSocketOnCB } from "@tests/utils";

export default class GameClient {
    private player1: Player;
    private player2: Player;
    private game: Game;
    private isFirstPlayerFirst: boolean;
    private first: jest.Mocked<Socket>;
    private second: jest.Mocked<Socket>;

    private constructor(socket1: jest.Mocked<Socket>, socket2: jest.Mocked<Socket>) {
        this.player1 = PlayerService.getPlayer(socket1.id);
        this.player2 = PlayerService.getPlayer(socket2.id);
        this.game = (LobbyService.getLobby(0) as Lobby).getGame() as Game;

        const isPlayer1First = this.game.getLastTurn().getPlayer() === this.player1;

        this.isFirstPlayerFirst = isPlayer1First;
        this.first = isPlayer1First ? socket1 : socket2;
        this.second = isPlayer1First ? socket2 : socket1;

        this.clearMocks();
    }

    static async create(configs: [string[], number | boolean][] = []) {
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

        getSocketOnCB(socket1, "beginMatch")();

        return new this(socket1, socket2);
    }

    static createMockImplementations(cards: CardType[] = []) {
        let i = 0;

        const randomCardTypeMock = jest.spyOn(CardTypeModule, "randomCardType")
            .mockImplementation(() => cards[i++]);

        const randomMock = jest.spyOn(Math, "random").mockReturnValue(0);

        return () => {
            randomCardTypeMock.mockRestore();
            randomMock.mockRestore();
        }
    }

    getGame() {
        return this.game;
    }

    firstSocket() {
        return this.first;
    }

    firstPlayer() {
        return this.isFirstPlayerFirst ? this.player1 : this.player2;
    }

    secondSocket() {
        return this.second;
    }

    secondPlayer() {
        return this.isFirstPlayerFirst ? this.player2 : this.player1;
    }

    firstPlayerDo<T extends Action>(action: T, ...args: Parameters<RequestSocketOnEvents[T]>) {
        // @ts-ignore
        getSocketOnCB(this.first, action)(...args);
    }

    secondPlayerDo<T extends Action>(action: T, ...args: Parameters<RequestSocketOnEvents[T]>) {
        // @ts-ignore
        getSocketOnCB(this.second, action)(...args);
    }

    clearMocks() {
        this.first.emit.mockClear();
        this.second.emit.mockClear();
    }
}