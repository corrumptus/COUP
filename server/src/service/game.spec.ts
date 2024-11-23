import { Socket } from "socket.io";
import { faker } from "@faker-js/faker";
import PlayerService from "./PlayerService";
import LobbyService from "./LobbyService";

function createSocket(lobbyId: number | undefined): jest.Mocked<Socket> {
    return {
        id: faker.number.int().toString(),
        handshake: {
            auth: {
                name: faker.person.fullName(),
                lobbyId: lobbyId
            },
            headers: {
                "user-agent": faker.internet.userAgent()
            }
        },
        emit: jest.fn(),
        on: jest.fn()
    } as any;
}

describe("game init", () => {
    it("should add a player correctly", () => {
        const socket1 = createSocket(undefined);

        PlayerService.setListeners(socket1);
        LobbyService.setListeners(socket1);

        expect(PlayerService.getPlayer(socket1.id)).not.toBeUndefined();
        expect(LobbyService.getLobby(0)).not.toBeUndefined();
    });

    it("should add two players correctly", () => {
        const socket1 = createSocket(undefined);

        PlayerService.setListeners(socket1);
        LobbyService.setListeners(socket1);

        const socket2 = createSocket(0);

        PlayerService.setListeners(socket2);
        LobbyService.setListeners(socket2);

        expect(PlayerService.getPlayer(socket2.id)).not.toBeUndefined();
        expect(LobbyService.getLobby(0)).not.toBeUndefined();
    });
});