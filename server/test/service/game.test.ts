import LobbyService from "@services/LobbyService";
import PlayerService from "@services/PlayerService";
import Action from "@entitys/Action";
import CardType from "@entitys/CardType";
import { CardSlot } from "@entitys/player";
import GameClient from "@tests/service/GameClient";
import GameStateFactory from "@tests/service/GameStateFactory";

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

    it("should send the correct game state for using a continuar after a bloquear after a ajuda externa", async () => {
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

    it("should send the correct game state for using a taxar", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.TAXAR, CardType.DUQUE, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.TAXAR, CardType.DUQUE, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for using a bloquear after a taxar when a card can block it", async () => {
        const gameClient = await GameClient.create([
            [ ["tiposCartas", "duque", "bloquearTaxar"], true ]
        ]);

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.firstPlayer())
                    .ofBeingAttacked(Action.BLOQUEAR, CardType.DUQUE, undefined, Action.TAXAR)
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

    it("should send the correct game state for using a continuar after a bloquear after a taxar when a card can block it", async () => {
        const gameClient = await GameClient.create([
            [ ["tiposCartas", "duque", "bloquearTaxar"], true ]
        ]);

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

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

    it("should send the correct game state for using a contestar after a bloquear after a taxar when a card can block it", async () => {
        const gameClient = await GameClient.create([
            [ ["tiposCartas", "duque", "bloquearTaxar"], true ]
        ]);

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTESTAR);

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

    it("should send the correct game state for using a contestar after a taxar", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateFactory(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });
});

describe("game, turn and players state in update", () => {
    afterEach(() => {
        LobbyService.getLobby(0)?.getState().players.forEach(p => {
            PlayerService.deletePlayerByName(0, p, "");
        });
    });

    it("should update player money when player use renda", async () => {
        const gameClient = await GameClient.create();

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.RENDA);

        expect(gameClient.firstPlayer().getMoney()).toBe(4);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(turn.getAllActions()).toStrictEqual([Action.RENDA]);
        expect(turn.getAllCards()).toStrictEqual([]);
        expect(turn.getAllCardTypes()).toStrictEqual([]);
        expect(game.getAsylumCoins()).toBe(0);
    });

    it("should update player money when player use ajuda externa", async () => {
        const gameClient = await GameClient.create();

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(turn.getAllActions()).toStrictEqual([Action.AJUDA_EXTERNA]);
        expect(turn.getAllCards()).toStrictEqual([]);
        expect(turn.getAllCardTypes()).toStrictEqual([]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toStrictEqual(turn);
    });

    it("should not update player money back to the original when using bloquear after player use ajuda externa", async () => {
        const gameClient = await GameClient.create();

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(turn.getAllActions()).toStrictEqual([Action.AJUDA_EXTERNA, Action.BLOQUEAR]);
        expect(turn.getAllCards()).toStrictEqual([0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toStrictEqual(turn);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
    });

    it("should not update player money when using bloquear after player use ajuda externa", async () => {
        const gameClient = await GameClient.create();

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(turn.getAllActions()).toStrictEqual([Action.AJUDA_EXTERNA, Action.BLOQUEAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toStrictEqual(turn);
    });

    it("should update player money when using contestar after a bloquear after player use ajuda externa when enemy player cant block it", async () => {
        const restoreMocks = GameClient.createMockImplementations([
            CardType.ASSASSINO,
            CardType.CAPITAO,
            CardType.CONDESSA,
            CardType.DUQUE
        ]);

        const gameClient = await GameClient.create();

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getCard(0 as CardSlot).getIsKilled()).toBe(true);
        expect(turn.getAllActions()).toStrictEqual([Action.AJUDA_EXTERNA, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toStrictEqual(turn);

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

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCard(0 as CardSlot).getIsKilled()).toBe(true);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(turn.getAllActions()).toStrictEqual([Action.AJUDA_EXTERNA, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toStrictEqual(turn);

        restoreMocks();
    });

    it("should update player money when using taxar", async () => {
        const gameClient = await GameClient.create();

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(6);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR]);
        expect(turn.getAllCards()).toStrictEqual([0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toStrictEqual(turn);
    });

    it("should not update player money when using bloquear after taxar", async () => {
        const gameClient = await GameClient.create([
            [ [ "tiposCartas", "duque", "bloquearTaxar" ], true ]
        ]);

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(6);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.BLOQUEAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toStrictEqual(turn);
    });

    it("should update player money back when using continuar after bloquear after taxar", async () => {
        const gameClient = await GameClient.create([
            [ [ "tiposCartas", "duque", "bloquearTaxar" ], true ]
        ]);

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.BLOQUEAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toStrictEqual(turn);
    });

    it("should not update player money back when using contestar after bloquear after taxar", async () => {
        const restoreMocks = GameClient.createMockImplementations([
            CardType.ASSASSINO,
            CardType.CAPITAO,
            CardType.CONDESSA,
            CardType.DUQUE
        ]);

        const gameClient = await GameClient.create([
            [ [ "tiposCartas", "duque", "bloquearTaxar" ], true ]
        ]);

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(6);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getCard(0 as CardSlot).getIsKilled()).toBe(true);
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toStrictEqual(turn);

        restoreMocks();
    });

    it("should =update player money back when using contestar after bloquear after taxar", async () => {
        const restoreMocks = GameClient.createMockImplementations([
            CardType.ASSASSINO,
            CardType.CAPITAO,
            CardType.DUQUE,
            CardType.CONDESSA
        ]);

        const gameClient = await GameClient.create([
            [ [ "tiposCartas", "duque", "bloquearTaxar" ], true ]
        ]);

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCard(0 as CardSlot).getIsKilled()).toBe(true);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toStrictEqual(turn);

        restoreMocks();
    });

    it("should not update player money back when using contestar after taxar", async () => {
        const restoreMocks = GameClient.createMockImplementations([
            CardType.DUQUE,
            CardType.ASSASSINO,
            CardType.CAPITAO,
            CardType.CONDESSA
        ]);

        const gameClient = await GameClient.create();

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(6);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getCard(0 as CardSlot).getIsKilled()).toBe(true);
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toStrictEqual(turn);

        restoreMocks();
    });

    it("should update player money back when using contestar after taxar", async () => {
        const restoreMocks = GameClient.createMockImplementations([
            CardType.ASSASSINO,
            CardType.CAPITAO,
            CardType.CONDESSA,
            CardType.DUQUE
        ]);

        const gameClient = await GameClient.create();

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCard(0 as CardSlot).getIsKilled()).toBe(true);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toStrictEqual(turn);

        restoreMocks();
    });
});