import LobbyService from "@services/LobbyService";
import PlayerService from "@services/PlayerService";
import Action from "@entitys/Action";
import CardType from "@entitys/CardType";
import type { CardSlot } from "@entitys/player";
import GameClient from "@tests/service/GameClient";
import GameStateBuilder from "@tests/service/GameStateBuilder";

describe("game state in update", () => {
    afterEach(() => {
        LobbyService.getLobby(0)?.getState().players.forEach(p => {
            PlayerService.deletePlayerByName(0, p, "");
        });
    });

    it("should send the correct game state for renda", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.RENDA);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.RENDA, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.RENDA, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for ajuda externa", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.AJUDA_EXTERNA, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.AJUDA_EXTERNA, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for bloquear after ajuda externa", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofBeingAttacked(Action.BLOQUEAR, CardType.DUQUE, undefined, Action.AJUDA_EXTERNA)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.BLOQUEAR, CardType.DUQUE, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for continuar after bloquear after ajuda externa", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for contestar after bloquear after ajuda externa", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for taxar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.TAXAR, CardType.DUQUE, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.TAXAR, CardType.DUQUE, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for bloquear after taxar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearTaxar"], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofBeingAttacked(Action.BLOQUEAR, CardType.DUQUE, undefined, Action.TAXAR)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.BLOQUEAR, CardType.DUQUE, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for continuar after bloquear after taxar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearTaxar"], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for contestar after bloquear after taxar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearTaxar"], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for contestar after taxar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for corrupcao", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["religiao", "reforma"], true ],
                [ ["religiao", "moedasIniciaisAsilo" ], 1 ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.CORRUPCAO, CardType.DUQUE, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CORRUPCAO, CardType.DUQUE, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CORRUPCAO, CardType.DUQUE, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for contestar after corrupcao", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["religiao", "reforma"], true ],
                [ ["religiao", "moedasIniciaisAsilo" ], 1 ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.CORRUPCAO, CardType.DUQUE, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.EXTORQUIR, CardType.CAPITAO, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofBeingAttacked(Action.EXTORQUIR, CardType.CAPITAO, undefined, undefined)
                    .create()
            );
    });

    it("should send the correct game state for bloquear after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CAPITAO, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofBeingAttacked(Action.BLOQUEAR, CardType.CAPITAO, undefined, Action.EXTORQUIR)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.BLOQUEAR, CardType.CAPITAO, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for continuar after bloquear after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CAPITAO, 0);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for contestar after bloquear after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CAPITAO, 0);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for contestar after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for continuar after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.ASSASSINAR, CardType.ASSASSINO, true, 0 as CardSlot, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofBeingAttacked(Action.ASSASSINAR, CardType.ASSASSINO, 0 as CardSlot, undefined)
                    .create()
            );
    });

    it("should send the correct game state for bloquear after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CONDESSA);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofBeingAttacked(Action.BLOQUEAR, CardType.CONDESSA, undefined, Action.ASSASSINAR)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.BLOQUEAR, CardType.CONDESSA, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for continuar after bloquear after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CONDESSA);
        
        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for contestar after bloquear after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CONDESSA);
        
        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for contestar after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for continuar after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.INVESTIGAR, CardType.INQUISIDOR, true, 0 as CardSlot, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofBeingAttacked(Action.INVESTIGAR, CardType.INQUISIDOR, 0 as CardSlot, undefined)
                    .create()
            );
    });

    it("should send the correct game state for bloquear after investigar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofBeingAttacked(Action.BLOQUEAR, CardType.DUQUE, undefined, Action.INVESTIGAR)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.BLOQUEAR, CardType.DUQUE, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for continuar after bloquear after investigar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);
        
        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for contestar after bloquear after investigar when will investigate", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofInvestigating(CardType.INQUISIDOR, 0 as CardSlot, CardType.CONDESSA, 0 as CardSlot)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, true)
                    .create()
            );
    });

    it("should send the correct game state for trocar after contestar after bloquear after investigar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.ASSASSINO,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.TROCAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.TROCAR, CardType.INQUISIDOR, true, 0 as CardSlot, true)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.TROCAR, CardType.INQUISIDOR, true, 0 as CardSlot, true)
                    .create()
            );
    });

    it("should send the correct game state for continuar after contestar after bloquear after investigar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.ASSASSINO,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, true)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, true)
                    .create()
            );
    });

    it("should send the correct game state for contestar after bloquear after investigar when will not investigate", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.CONDESSA
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for contestar after investigar when will investigate", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.CONDESSA
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofInvestigating(CardType.INQUISIDOR, 0 as CardSlot, CardType.DUQUE, 0 as CardSlot)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, true)
                    .create()
            );
    });

    it("should send the correct game state for trocar after contestar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.CONDESSA
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.TROCAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.TROCAR, CardType.INQUISIDOR, true, 0 as CardSlot, true)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.TROCAR, CardType.INQUISIDOR, true, 0 as CardSlot, true)
                    .create()
            );
    });

    it("should send the correct game state for continuar after contestar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.CONDESSA
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, true)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, true)
                    .create()
            );
    });

    it("should send the correct game state for contestar after investigar when will not investigate", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingEnemy(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.CONTESTAR, undefined, true, undefined, false)
                    .create()
            );
    });

    it("should send the correct game state for continuar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.ASSASSINO
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.clearMocks();

        gameClient.secondPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofInvestigating(CardType.INQUISIDOR, 0 as CardSlot, CardType.DUQUE, 0 as CardSlot)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, true)
                    .create()
            );
    });

    it("should send the correct game state for trocar after continuar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.ASSASSINO
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTINUAR);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.TROCAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.TROCAR, CardType.INQUISIDOR, true, 0 as CardSlot, true)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.TROCAR, CardType.INQUISIDOR, true, 0 as CardSlot, true)
                    .create()
            );
    });

    it("should send the correct game state for continuar after continuar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.ASSASSINO
            ]
        );

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTINUAR);

        gameClient.clearMocks();

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.firstPlayer())
                    .ofSeeingSelf(Action.CONTINUAR, undefined, false, undefined, true)
                    .create()
            );
        expect(gameClient.secondSocket().emit)
            .toHaveBeenCalledWith(
                "updatePlayer",
                new GameStateBuilder(gameClient.getGame(), gameClient.secondPlayer())
                    .ofSeeingEnemy(Action.CONTINUAR, undefined, false, undefined, true)
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

    it("should update player money for using renda", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.RENDA);

        expect(gameClient.firstPlayer().getMoney()).toBe(4);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(undefined);
        expect(turn.getAllActions()).toStrictEqual([Action.RENDA]);
        expect(turn.getAllCards()).toStrictEqual([]);
        expect(turn.getAllCardTypes()).toStrictEqual([]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player money for using ajuda externa", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(undefined);
        expect(turn.getAllActions()).toStrictEqual([Action.AJUDA_EXTERNA]);
        expect(turn.getAllCards()).toStrictEqual([]);
        expect(turn.getAllCardTypes()).toStrictEqual([]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player money for using bloquear after ajuda externa", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.AJUDA_EXTERNA, Action.BLOQUEAR]);
        expect(turn.getAllCards()).toStrictEqual([0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should not update player money for using continuar after bloquear after ajuda externa", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.AJUDA_EXTERNA, Action.BLOQUEAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player money for using contestar after bloquear after ajuda externa", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.AJUDA_EXTERNA, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update player money for using contestar after bloquear after ajuda externa", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.CONDESSA
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.AJUDA_EXTERNA);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.DUQUE, CardType.CONDESSA]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.AJUDA_EXTERNA, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player money for using taxar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(6);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(undefined);
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR]);
        expect(turn.getAllCards()).toStrictEqual([0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player money for using bloquear after taxar", async () => {
        const gameClient = await GameClient.create(
            [
                [ [ "tiposCartas", "duque", "bloquearTaxar" ], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(6);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.BLOQUEAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should not update player money for using continuar after bloquear after taxar", async () => {
        const gameClient = await GameClient.create(
            [
                [ [ "tiposCartas", "duque", "bloquearTaxar" ], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.BLOQUEAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player money for using contestar after bloquear after taxar", async () => {
        const gameClient = await GameClient.create(
            [
                [ [ "tiposCartas", "duque", "bloquearTaxar" ], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(6);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update player money for using contestar after bloquear after taxar", async () => {
        const gameClient = await GameClient.create(
            [
                [ [ "tiposCartas", "duque", "bloquearTaxar" ], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.CONDESSA
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.DUQUE, CardType.CONDESSA]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player money for using contestar after taxar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.DUQUE,
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(6);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.DUQUE, CardType.ASSASSINO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.CONDESSA]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update player money for using contestar after taxar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.TAXAR, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.TAXAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player money for using corrupcao", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["religiao", "reforma"], true ],
                [ ["religiao", "moedasIniciaisAsilo" ], 1 ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        expect(game.getAsylumCoins()).toBe(1);

        gameClient.firstPlayerDo(Action.CORRUPCAO, CardType.DUQUE, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(4);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).not.toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).not.toBe(undefined);
        expect(turn.getTarget()).toBe(undefined);
        expect(turn.getAllActions()).toStrictEqual([Action.CORRUPCAO]);
        expect(turn.getAllCards()).toStrictEqual([0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player money for using contestar after corrupcao", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["religiao", "reforma"], true ],
                [ ["religiao", "moedasIniciaisAsilo" ], 1 ]
            ],
            false,
            [
                CardType.DUQUE,
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.CORRUPCAO, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(4);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.DUQUE, CardType.ASSASSINO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.CONDESSA]);
        expect(gameClient.firstPlayer().getReligion()).not.toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).not.toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.CORRUPCAO, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update player money for using contestar after corrupcao", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["religiao", "reforma"], true ],
                [ ["religiao", "moedasIniciaisAsilo" ], 1 ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.CORRUPCAO, CardType.DUQUE, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).not.toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).not.toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.CORRUPCAO, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(1);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update player moneys for using extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.EXTORQUIR]);
        expect(turn.getAllCards()).toStrictEqual([0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.CAPITAO]);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should not update player moneys for using bloquear after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CAPITAO, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.EXTORQUIR, Action.BLOQUEAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.CAPITAO, CardType.CAPITAO]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should not update player moneys for using continuar after bloquear after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CAPITAO, 0);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.EXTORQUIR, Action.BLOQUEAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.CAPITAO, CardType.CAPITAO]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player moneys for using contestar after bloquear after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.CAPITAO,
                CardType.ASSASSINO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CAPITAO, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(1);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.ASSASSINO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.EXTORQUIR, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.CAPITAO, CardType.CAPITAO]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update player moneys for using contestar after bloquear after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CONDESSA,
                CardType.CAPITAO,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CAPITAO, 0);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CONDESSA]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.EXTORQUIR, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.CAPITAO, CardType.CAPITAO]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player moneys for using contestar after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.CAPITAO,
                CardType.ASSASSINO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(1);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.ASSASSINO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.EXTORQUIR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.CAPITAO]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update player moneys for using contestar after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CONDESSA,
                CardType.CAPITAO,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.secondPlayerDo(Action.CONTESTAR, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CONDESSA]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.EXTORQUIR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.CAPITAO]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update player moneys for using continuar after extorquir", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.EXTORQUIR, CardType.CAPITAO, 0, gameClient.secondPlayer().name);

        gameClient.secondPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(5);
        expect(gameClient.secondPlayer().getMoney()).toBe(1);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.EXTORQUIR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.CAPITAO]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update target cards for using assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(0);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.ASSASSINAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.ASSASSINO]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should not update target cards for using bloquear after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CONDESSA);

        expect(gameClient.firstPlayer().getMoney()).toBe(0);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.ASSASSINAR, Action.BLOQUEAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.ASSASSINO, CardType.CONDESSA]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should not update target cards for using continuar after bloquear after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CONDESSA);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(0);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.ASSASSINAR, Action.BLOQUEAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.ASSASSINO, CardType.CONDESSA]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update target cards for using contestar after bloquear after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.CAPITAO,
                CardType.ASSASSINO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CONDESSA);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(0);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.ASSASSINO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.ASSASSINAR, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.ASSASSINO, CardType.CONDESSA]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update target cards for using contestar after bloquear after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            true,
            [
                CardType.ASSASSINO,
                CardType.CONDESSA,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.CONDESSA,
                CardType.CAPITAO,
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.CONDESSA);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(0);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, true]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CONDESSA]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.ASSASSINAR, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.ASSASSINO, CardType.CONDESSA]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update target cards for using contestar after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.CAPITAO,
                CardType.ASSASSINO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(0);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.ASSASSINO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.ASSASSINAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.ASSASSINO]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update target cards for using contestar after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            true,
            [
                CardType.ASSASSINO,
                CardType.CONDESSA,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.CONDESSA,
                CardType.CAPITAO
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(0);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, true]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CONDESSA]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.ASSASSINAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.ASSASSINO]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update target cards for using continuar after assassinar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.ASSASSINAR, CardType.ASSASSINO, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(0);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.ASSASSINAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.ASSASSINO]);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update target cards for using investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should not update target cards for using bloquear after investigar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.BLOQUEAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should not update target cards for using continuar after bloquear after investigar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.BLOQUEAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update target cards for using contestar after bloquear after investigar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.INQUISIDOR,
                CardType.ASSASSINO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, true]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.INQUISIDOR, CardType.ASSASSINO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should update target cards for using trocar after contestar after bloquear after investigar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CONDESSA,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.ASSASSINO
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        gameClient.firstPlayerDo(Action.TROCAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, true]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.INQUISIDOR, CardType.CONDESSA]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.BLOQUEAR, Action.CONTESTAR, Action.TROCAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update target cards for using continuar after contestar after bloquear after investigar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CONDESSA,
                CardType.CAPITAO,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, true]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.INQUISIDOR, CardType.CONDESSA]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.BLOQUEAR, Action.CONTESTAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should update player cards for using contestar after bloquear after investigar", async () => {
        const gameClient = await GameClient.create(
            [
                [ ["tiposCartas", "duque", "bloquearInvestigar"], true ]
            ],
            false,
            [
                CardType.INQUISIDOR,
                CardType.ASSASSINO,
                CardType.DUQUE,
                CardType.CONDESSA
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.BLOQUEAR, CardType.DUQUE);

        gameClient.firstPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.INQUISIDOR, CardType.ASSASSINO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.DUQUE, CardType.CONDESSA]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.BLOQUEAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR, CardType.DUQUE]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update target cards for using contestar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            true,
            [
                CardType.INQUISIDOR,
                CardType.CONDESSA,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.ASSASSINO,
                CardType.EMBAIXADOR
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, true]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.INQUISIDOR, CardType.CONDESSA]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should update target cards for using trocar after contestar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CONDESSA,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.ASSASSINO
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR);

        gameClient.firstPlayerDo(Action.TROCAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, true]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.INQUISIDOR, CardType.CONDESSA]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.CONTESTAR, Action.TROCAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update target cards for using continuar after contestar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CONDESSA,
                CardType.CAPITAO,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, true]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.INQUISIDOR, CardType.CONDESSA]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CAPITAO, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.CONTESTAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should update player cards for using contestar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTESTAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([true, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.CONTESTAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR]);
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update target cards for using continuar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR]);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });

    it("should update target cards to diferents for using trocar after continuar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.CONDESSA,
                CardType.ASSASSINO
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTINUAR);

        gameClient.firstPlayerDo(Action.TROCAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.INQUISIDOR, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CONDESSA]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.CONTINUAR, Action.TROCAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR]);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should update target cards to the same for using trocar after continuar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.INQUISIDOR,
                CardType.CAPITAO,
                CardType.DUQUE,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTINUAR);

        gameClient.firstPlayerDo(Action.TROCAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.INQUISIDOR, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.DUQUE, CardType.CONDESSA]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.CONTINUAR, Action.TROCAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR]);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).not.toBe(turn);
    });

    it("should not update target cards for using continuar after continuar after investigar", async () => {
        const gameClient = await GameClient.create(
            [],
            false,
            [
                CardType.ASSASSINO,
                CardType.CAPITAO,
                CardType.CONDESSA,
                CardType.DUQUE
            ]
        );

        const game = gameClient.getGame();
        const turn = game.getLastTurn();

        gameClient.firstPlayerDo(Action.INVESTIGAR, CardType.INQUISIDOR, 0, gameClient.secondPlayer().name, 0);

        gameClient.secondPlayerDo(Action.CONTINUAR);

        gameClient.firstPlayerDo(Action.CONTINUAR);

        expect(gameClient.firstPlayer().getMoney()).toBe(3);
        expect(gameClient.secondPlayer().getMoney()).toBe(3);
        expect(gameClient.firstPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getIsKilled())).toStrictEqual([false, false]);
        expect(gameClient.firstPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.ASSASSINO, CardType.CAPITAO]);
        expect(gameClient.secondPlayer().getCards().map(c => c.getType())).toStrictEqual([CardType.CONDESSA, CardType.DUQUE]);
        expect(gameClient.firstPlayer().getReligion()).toBe(undefined);
        expect(gameClient.secondPlayer().getReligion()).toBe(undefined);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(turn.getAllActions()).toStrictEqual([Action.INVESTIGAR, Action.CONTINUAR, Action.CONTINUAR]);
        expect(turn.getAllCards()).toStrictEqual([0, 0]);
        expect(turn.getAllCardTypes()).toStrictEqual([CardType.INQUISIDOR]);
        expect(turn.getTarget()).toBe(gameClient.secondPlayer());
        expect(game.getAsylumCoins()).toBe(0);
        expect(game.getLastTurn()).toBe(turn);
    });
});