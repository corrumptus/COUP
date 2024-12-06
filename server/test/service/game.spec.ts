import Action from "../../src/entity/Action";
import CardType from "../../src/entity/CardType";
import { CardSlot } from "../../src/entity/player";
import LobbyService from "../../src/service/LobbyService";
import PlayerService from "../../src/service/PlayerService";
import GameClient from "./GameClient";
import GameStateFactory from "./GameStateFactory";

describe("game state in update", () => {
    afterEach(() => {
        LobbyService.getLobby(0)?.getState().players.forEach(p => {
            PlayerService.deletePlayerByName(0, p, "");
        });
    });

    it("should send the correct game state for renda", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.RENDA);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.RENDA, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.RENDA, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for ajuda externa", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.AJUDA_EXTERNA, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.AJUDA_EXTERNA, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for using bloquear after a ajuda externa", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.firstPlayer())
                    .ofBeingAttacked(Action.BLOQUEAR, CardType.DUQUE, undefined, Action.AJUDA_EXTERNA)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.BLOQUEAR, CardType.DUQUE, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for using bloquear after a ajuda externa", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for using a contestar after using a bloquear after a ajuda externa", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });
});

describe("game and players state in update", () => {
    afterEach(() => {
        LobbyService.getLobby(0)?.getState().players.forEach(p => {
            PlayerService.deletePlayerByName(0, p, "");
        });
    });

    it("should update player money when player use renda", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.RENDA);

        expect(gameClient.firstPlayer().getMoney()).toBe(4);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
    });

    it("should update player money when player use ajuda externa", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
    });

    it("should not update player money when using bloquear after player use ajuda externa", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
    });

    it("should update player money when using contestar after a bloquear after player use ajuda externa when enemy player cant block it", async () => {
        const restoreMocks = GameClient.createMockImplementations([
            CardType.ASSASSINO,
            CardType.CAPITAO,
            CardType.CONDESSA,
            CardType.DUQUE
        ]);

        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getCard(0 as CardSlot).getIsKilled()).toBe(true);

        restoreMocks();
    });

    it("should not update player money when using contestar after a bloquear after player use ajuda externa when enemy player can block it", async () => {
        const restoreMocks = GameClient.createMockImplementations([
            CardType.ASSASSINO,
            CardType.CAPITAO,
            CardType.DUQUE,
            CardType.CONDESSA
        ]);

        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCard(0 as CardSlot).getIsKilled()).toBe(true);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);

        restoreMocks();
    });
});