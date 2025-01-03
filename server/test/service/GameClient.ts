import type { Socket } from "socket.io";
import GameService from "@services/GameService";
import LobbyService from "@services/LobbyService";
import PlayerService from "@services/PlayerService";
import type { RequestSocketOnEvents } from "@socket/socket";
import type Action from "@entitys/Action";
import CardType, * as CardTypeModule from "@entitys/CardType";
import Religion, * as ReligionModule from "@entitys/Religion";
import type Game from "@entitys/Game";
import type Lobby from "@entitys/Lobby";
import type Player from "@entitys/player";
import { createSocket, getSocketOnCB } from "@tests/utils";

export default class GameClient {
    private socket1: jest.Mocked<Socket>;
    private socket2: jest.Mocked<Socket>;
    private socket3: jest.Mocked<Socket> | undefined;
    private player1: Player;
    private player2: Player;
    private player3: Player | undefined;
    private game: Game;

    private constructor(socket1: jest.Mocked<Socket>, socket2: jest.Mocked<Socket>, socket3: jest.Mocked<Socket> | undefined) {
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.socket3 = socket3;

        this.player1 = PlayerService.getPlayer(socket1.id);
        this.player2 = PlayerService.getPlayer(socket2.id);
        this.player3 = socket3 !== undefined ? PlayerService.getPlayer(socket3.id) : undefined;

        this.game = (LobbyService.getLobby(0) as Lobby).getGame() as Game;

        this.clearMocks();
    }

    static async create<B extends boolean>(
        configs: [string[], number | boolean][],
        createAnotherPlayer: B,
        cards: B extends false ?
            [CardType, CardType, CardType, CardType, ...CardType[]]
            :
            [CardType, CardType, CardType, CardType, CardType, CardType, ...CardType[]],
        religions?: B extends false ?
            [Religion, Religion, ...Religion[]]
            :
            [Religion, Religion, Religion, ...Religion[]]
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

        let socket3 = undefined;

        if (createAnotherPlayer) {
            socket3 = createSocket(0);

            await PlayerService.setListeners(socket3);
            LobbyService.setListeners(socket3);
            GameService.setListeners(socket3);

            getSocketOnCB(socket3, "canReceive")();
        }

        GameClient.createMockImplementations(cards, religions);

        getSocketOnCB(socket1, "beginMatch")();

        return new this(socket1, socket2, socket3);
    }

    private static createMockImplementations(cards: CardType[], religions?: Religion[]) {
        let cardIndex = 0;
        let religionIndex = 0;
        let randomIndex = 0;

        jest.spyOn(CardTypeModule, "randomCardType")
            .mockImplementation(() => cards[cardIndex++]);

        if (religions !== undefined)
            jest.spyOn(ReligionModule, "randomReligion")
                .mockImplementation(() => religions[religionIndex++]);

        jest.spyOn(Math, "random").mockImplementation(() => {
            const cur = [
                0,
                0.9
            ][randomIndex];

            randomIndex = (randomIndex+1)%2;

            return cur;
        });
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

    thirdSocket() {
        return this.socket3;
    }

    thirdPlayer() {
        return this.player3;
    }

    thirdPlayerDo<T extends Action>(action: T, ...args: Parameters<RequestSocketOnEvents[T]>) {
        // @ts-ignore
        getSocketOnCB(this.socket3, action)(...args);
    }

    clearMocks() {
        this.socket1.emit.mockClear();
        this.socket2.emit.mockClear();
        this.socket3?.emit.mockClear();
    }

    disconnectFirst() {
        getSocketOnCB(this.socket1, "disconnect")("client namespace disconnect");
        // this.socket1.disconnect();
    }

    disconnectSecond() {
        getSocketOnCB(this.socket2, "disconnect")("client namespace disconnect");
    }
}