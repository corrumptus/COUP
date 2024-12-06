import LobbyService from "@services/LobbyService";
import PlayerService from "@services/PlayerService";
import { createSocket } from "@tests/utils";

describe("lobby interactions", () => {
    it("should add a player correctly", async () => {
        const socket1 = createSocket(undefined);

        await PlayerService.setListeners(socket1);
        LobbyService.setListeners(socket1);

        expect(PlayerService.getPlayer(socket1.id)).not.toBeUndefined();
        expect(LobbyService.getLobby(0)).not.toBeUndefined();
    });

    it("should add two players correctly", async () => {
        const socket1 = createSocket(undefined);

        await PlayerService.setListeners(socket1);
        LobbyService.setListeners(socket1);

        const socket2 = createSocket(0);

        await PlayerService.setListeners(socket2);
        LobbyService.setListeners(socket2);

        expect(PlayerService.getPlayer(socket2.id)).not.toBeUndefined();
        expect(LobbyService.getLobby(0)).not.toBeUndefined();
    });
});