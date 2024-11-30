import { Socket } from "socket.io";
import { faker } from "@faker-js/faker";
import PlayerService from "../../src/service/PlayerService";
import LobbyService from "../../src/service/LobbyService";
import { RequestSocketOnEvents } from "../../src/socket/socket";

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

function getSocketOnCB<T extends keyof RequestSocketOnEvents | string>(
    socket: jest.Mocked<Socket>,
    event: T
): T extends keyof RequestSocketOnEvents ? RequestSocketOnEvents[T] : Function {
    return (
        socket.on.mock.calls
            .find(([ ev ]) => ev === event) as [
                string,
                T extends keyof RequestSocketOnEvents ?
                    RequestSocketOnEvents[T]
                    :
                    Function
            ]
    )[1];
}

describe("lobby interactions", () => {
    async function initLobby() {
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

        return {
            socket1: socket1,
            player1: player1,
            socket2: socket2,
            player2: player2
        };
    }

    afterEach(() => {
        LobbyService.getLobby(0)?.getState().players.forEach(p => {
            PlayerService.deletePlayerByName(0, p, "");
        });
    });

    it("should not remove lobby from the lobby discovery before game starts", async () => {
        await initLobby();

        expect(LobbyService.allLobbys.length).toBe(1);
    });

    it("should not remove lobby from the lobby discovery before game starts when a owner player leaves", async () => {
        const { socket1 } = await initLobby();

        getSocketOnCB(socket1, "disconnect")("client namespace disconnect");

        expect(LobbyService.allLobbys.length).toBe(1);
    });

    it("should not remove lobby from the lobby discovery before game starts when a non-owner player leaves", async () => {
        const { socket2 } = await initLobby();

        getSocketOnCB(socket2, "disconnect")("client namespace disconnect");

        expect(LobbyService.allLobbys.length).toBe(1);
    });

    it("should remove first player and turn the second into the owner", async () => {
        const { socket1, player1, socket2, player2 } = await initLobby();

        getSocketOnCB(socket1, "disconnect")("client namespace disconnect");

        expect(socket1.disconnect).toHaveBeenCalled();
        expect(() => PlayerService.getPlayer(socket1.id))
            .toThrow(new TypeError("Cannot read properties of undefined (reading 'player')"));
        expect(LobbyService.getLobby(0)?.isOwner(player1)).toBe(false);
        expect(LobbyService.getLobby(0)?.isOwner(player2)).toBe(true);
        expect(socket2.emit).toHaveBeenCalledWith("leavingPlayer", player1.name);
        expect(socket2.emit).toHaveBeenCalledWith("newOwner", player2.name);
    });

    it("should turn the second player into the onwer", async () => {
        const { socket1, player1, socket2, player2 } = await initLobby();

        getSocketOnCB(socket1, "newOwner")(player2.name);

        expect(socket1.emit).toHaveBeenCalledWith("newOwner", player2.name);
        expect(socket2.emit).toHaveBeenCalledWith("newOwner", player2.name);
        expect(LobbyService.getLobby(0)?.isOwner(player1)).toBe(false);
        expect(LobbyService.getLobby(0)?.isOwner(player2)).toBe(true);
    });

    it("should turn the first player into the onwer after the second being turned into the owner", async () => {
        const { socket1, player1, socket2, player2 } = await initLobby();

        getSocketOnCB(socket1, "newOwner")(player2.name);

        getSocketOnCB(socket2, "newOwner")(player1.name);

        expect(socket1.emit).toHaveBeenCalledWith("newOwner", player1.name);
        expect(socket2.emit).toHaveBeenCalledWith("newOwner", player1.name);
        expect(LobbyService.getLobby(0)?.isOwner(player1)).toBe(true);
        expect(LobbyService.getLobby(0)?.isOwner(player2)).toBe(false);
    });

    it("should remove the second player when owner removes it", async () => {
        const { socket1, socket2, player2 } = await initLobby();

        getSocketOnCB(socket1, "removePlayer")(player2.name);

        expect(socket1.emit).toHaveBeenCalledWith("leavingPlayer", player2.name);
        expect(socket2.disconnect).toHaveBeenCalled();
        expect(socket2.emit).toHaveBeenCalledWith("disconnectReason", "Jogador removido pelo dono do jogo");
        expect(() => PlayerService.getPlayer(socket2.id))
            .toThrow(new TypeError("Cannot read properties of undefined (reading 'player')"));
    });

    it("should change configs when lobby owner changes it", async () => {
        const { socket1, socket2 } = await initLobby();

        getSocketOnCB(socket1, "updateConfigs")(["religiao", "reforma"], true);
        getSocketOnCB(socket1, "updateConfigs")(["renda"], 3);
        getSocketOnCB(socket1, "updateConfigs")(["tiposCartas", "duque", "investigar"], true);

        expect(socket1.emit).toHaveBeenCalledWith("configsUpdated", ["religiao", "reforma"], true);
        expect(socket1.emit).toHaveBeenCalledWith("configsUpdated", ["renda"], 3);
        expect(socket1.emit).toHaveBeenCalledWith("configsUpdated", ["tiposCartas", "duque", "investigar"], true);

        expect(socket2.emit).toHaveBeenCalledWith("configsUpdated", ["religiao", "reforma"], true);
        expect(socket2.emit).toHaveBeenCalledWith("configsUpdated", ["renda"], 3);
        expect(socket2.emit).toHaveBeenCalledWith("configsUpdated", ["tiposCartas", "duque", "investigar"], true);
    });

    it("should change lobby password when lobby owner changes it", async () => {
        const { socket1, socket2 } = await initLobby();

        const password = faker.internet.password();

        getSocketOnCB(socket1, "changePassword")(password);

        expect(socket1.emit).toHaveBeenCalledWith("passwordUpdated", password);
        expect(socket2.emit).toHaveBeenCalledWith("passwordUpdated", password);
    });

    it("should remove lobby password when lobby owner removes it", async () => {
        const { socket1, socket2 } = await initLobby();

        getSocketOnCB(socket1, "removePassword")();

        expect(socket1.emit).toHaveBeenCalledWith("passwordUpdated");
        expect(socket2.emit).toHaveBeenCalledWith("passwordUpdated");
    });
});