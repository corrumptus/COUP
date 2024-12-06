import { faker } from "@faker-js/faker";
import { ContextType } from "@services/GameMessageService";
import LobbyService from "@services/LobbyService";
import PlayerService from "@services/PlayerService";
import SocketValidatorService from "@services/SocketValidatorService";
import Game from "@entitys/Game";
import { createSocket, getSocketOnCB } from "@tests/utils";

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

    it("should enter in lobby when pass the correct password", async () => {
        const { socket1 } = await initLobby();

        const password = faker.internet.password();

        getSocketOnCB(socket1, "changePassword")(password);

        const socket3 = createSocket(0, password);

        const error = SocketValidatorService.validate(socket3);

        expect(error).toBeUndefined();
    });

    it("should not enter in lobby when pass the incorrect password", async () => {
        const { socket1 } = await initLobby();

        const password = faker.internet.password();

        getSocketOnCB(socket1, "changePassword")(password);

        const socket3 = createSocket(0, faker.internet.password());

        const error = SocketValidatorService.validate(socket3);

        expect(error).toBe("A senha está incorreta");
    });

    it("should remove lobby password when lobby owner removes it", async () => {
        const { socket1, socket2 } = await initLobby();

        getSocketOnCB(socket1, "removePassword")();

        expect(socket1.emit).toHaveBeenCalledWith("passwordUpdated");
        expect(socket2.emit).toHaveBeenCalledWith("passwordUpdated");
    });

    it("should initiate lobby when lobby owner begins it", async () => {
        const { socket1, player1, socket2, player2 } = await initLobby();

        getSocketOnCB(socket1, "beginMatch")();

        const gameState = (PlayerService.getPlayersLobby(socket1.id).getGame() as Game).getState();

        const player1GameState = {
            player: player1.getState(),
            game: {
                ...gameState,
                players: gameState.players.filter(p => p.name !== player1.name)
            },
            context: {
                type: ContextType.OBSERVING,
                attacker: gameState.currentPlayer,
                isInvestigating: false
            }
        };

        const player2GameState = {
            player: player2.getState(),
            game: {
                ...gameState,
                players: gameState.players.filter(p => p.name !== player2.name)
            },
            context: {
                type: ContextType.OBSERVING,
                attacker: gameState.currentPlayer,
                isInvestigating: false
            }
        };

        const socket1SessionCode = PlayerService.getSessionCode(socket1.id);
        const socket2SessionCode = PlayerService.getSessionCode(socket2.id);

        expect(socket1.emit).toHaveBeenCalledWith("beginMatch", player1GameState, socket1SessionCode);
        expect(socket2.emit).toHaveBeenCalledWith("beginMatch", player2GameState, socket2SessionCode);
        expect(LobbyService.allLobbys.length).toBe(0);
    });
});