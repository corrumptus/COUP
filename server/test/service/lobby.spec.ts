import { Socket } from "socket.io";
import { faker } from "@faker-js/faker";
import PlayerService from "../../src/service/PlayerService";
import LobbyService from "../../src/service/LobbyService";

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

function getSocketOnCB(socket: jest.Mocked<Socket>, event: string): Function {
    return (
        socket.on.mock.calls
            .find(([ ev ]) => ev === event) as [ string, Function ]
    )[1];
}

describe("lobby interactions", () => {
    it("should remove first player and turn the second into the owner", async () => {
        const socket1 = createSocket(undefined);

        await PlayerService.setListeners(socket1);
        LobbyService.setListeners(socket1);

        const player1 = PlayerService.getPlayer(socket1.id);

        getSocketOnCB(socket1, "canReceive")();

        const socket2 = createSocket(0);

        await PlayerService.setListeners(socket2);
        LobbyService.setListeners(socket2);

        const player2 = PlayerService.getPlayer(socket2.id);

        getSocketOnCB(socket2, "canReceive")();

        getSocketOnCB(socket1, "disconnect")("client namespace disconnect");

        expect(socket1.disconnect).toHaveBeenCalled();
        expect(() => PlayerService.getPlayer(socket1.id))
            .toThrow(new TypeError("Cannot read properties of undefined (reading 'player')"));
        expect(LobbyService.getLobby(0)?.isOwner(player1)).toBe(false);
        expect(LobbyService.getLobby(0)?.isOwner(player2)).toBe(true);
        expect(socket2.emit).toHaveBeenCalledWith("leavingPlayer", player1.name);
        expect(socket2.emit).toHaveBeenCalledWith("newOwner", player2.name);
    });
});