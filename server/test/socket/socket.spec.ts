import { Socket } from "socket.io";
import { faker } from "@faker-js/faker";
import LobbyService from "../../src/service/LobbyService";
import PlayerService from "../../src/service/PlayerService";

function createSocket(lobbyId: number | undefined): jest.Mocked<Socket> {
    return {
        id: faker.number.int().toString(),
        handshake: {
            auth: {
                name: faker.person.fullName(),
                lobby: lobbyId
            },
            headers: {
                "user-agent": faker.internet.userAgent()
            }
        },
        emit: jest.fn(),
        on: jest.fn(),
        disconnect: jest.fn()
    } as any;
}

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