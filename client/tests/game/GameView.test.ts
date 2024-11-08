import { waitFor } from "@testing-library/dom";
import GameViewPO from "./GameViewPO";
import GameStateFactory from "./GameStateFactory";
import { SocketEmitMock } from "./SocketMock";

jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useRouter: jest.fn()
}));

describe("Game view render in game init", () => {
    it("should render correctly in the game beginning when player is the first player and default configurations in pc view", async () => {
        const gameState = new GameStateFactory().create();

        const gameView = new GameViewPO(gameState);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).not.toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(gameState.game.currentPlayer);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is not the first player and default configurations in pc view", async () => {
        const gameState = new GameStateFactory().toOtherPlayerTurn().create();

        const gameView = new GameViewPO(gameState);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).not.toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(gameState.game.players[0].name);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is the first player and no default configurations in pc view", async () => {
        const gameState = new GameStateFactory()
            .newConfig(["moedasIniciais"], (val: number) => val+1)
            .newConfig(["renda"], (val: number) => val+1)
            .newConfig(["ajudaExterna"], (val: number) => val-1)
            .create();

        const expectedConfigDiffs = [
            "Moedas iniciais: 3 -> 4",
            "Renda: 1 -> 2",
            "Ajuda externa: 2 -> 1"
        ];

        const gameView = new GameViewPO(gameState);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).not.toBeInTheDocument();
        expect(gameView.nextPerson()).not.toBeInTheDocument();
        expect(gameView.configDiffs()).toBeInTheDocument();

        gameView.allConfigDiffTextContent().forEach((text, i) => {
            expect(text).toHaveTextContent(expectedConfigDiffs[i]);
        });
    });

    it("should render correctly in the game beginning when player is the first player and default configurations in mobile view", async () => {
        const gameState = new GameStateFactory().create();

        const gameView = new GameViewPO(gameState, 500);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(gameState.game.currentPlayer);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is not the first player and default configurations in mobile view", async () => {
        const gameState = new GameStateFactory().toOtherPlayerTurn().create();

        const gameView = new GameViewPO(gameState, 500);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(gameState.game.players[0].name);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is the first player and no default configurations in mobile view", async () => {
        const gameState = new GameStateFactory()
            .newConfig(["moedasIniciais"], (val: number) => val+1)
            .newConfig(["renda"], (val: number) => val+1)
            .newConfig(["ajudaExterna"], (val: number) => val-1)
            .create();

        const expectedConfigDiffs = [
            "Moedas iniciais: 3 -> 4",
            "Renda: 1 -> 2",
            "Ajuda externa: 2 -> 1"
        ];

        const gameView = new GameViewPO(gameState, 500);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).toBeInTheDocument();
        expect(gameView.nextPerson()).not.toBeInTheDocument();
        expect(gameView.configDiffs()).toBeInTheDocument();

        gameView.allConfigDiffTextContent().forEach((text, i) => {
            expect(text).toHaveTextContent(expectedConfigDiffs[i]);
        });
    });
});

describe("Game View render in game actions", () => {
    it("should perform a renda action correctly", async () => {
        const gameState = new GameStateFactory().create();

        const gameView = new GameViewPO(gameState);

        gameView.closeNextPerson();

        await waitFor(() => {
            expect(gameView.nextPerson()).not.toBeInTheDocument();
        });

        gameView.openMoneyMenu();

        await waitFor(() => {
            expect(gameView.actionMenu()).toBeInTheDocument();
            expect(gameView.moneyMenu()).toBeInTheDocument();
        });

        gameView.selectRenda();

        await waitFor(() => {
            expect(gameView.actionMenu()).not.toBeInTheDocument();
            expect(gameView.moneyMenu()).not.toBeInTheDocument();
        });

        expect(socketEmitMock).toHaveBeenCalledWith("renda");
    });
});