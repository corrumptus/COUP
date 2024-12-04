import Action from "../../src/entity/Action";
import GameClient from "./GameClient";
import GameStateFactory from "./GameStateFactory";

describe("game state in update", () => {
    it("should send the correct game state for renda", async () => {
        const gameClient = await GameClient.create();

        gameClient.firstPlayerDo("renda");

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
});