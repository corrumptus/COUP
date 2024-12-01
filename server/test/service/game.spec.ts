import GameClient from "./GameClient";

describe("game state in update", () => {
    it("should send the correct game state for renda", async () => {
        const gameClient = await GameClient.create();

        const expectedGameState = gameClient.firstDo("renda");

        expect(gameClient.firstSocket().emit)
            .toHaveBeenCalledWith("updatePlayer", expectedGameState);
    });
});