import { waitFor } from "@testing-library/dom";
import GameViewPO from "./GameViewPO";
import GameStateFactory from "./GameStateFactory";

jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useRouter: jest.fn()
}));

const socketEmitMock = jest.fn();

jest.mock("socket.io-client", () => ({
    ...jest.requireActual("socket.io-client"),
    io: () => ({
        emit: socketEmitMock,
        on: jest.fn(),
        removeAllListeners: jest.fn()
    })
}));

describe("Game view render in game init", () => {
    it("should render correctly in the game beginning when player is the first player and default configurations in pc view", async () => {
        const gameState = new GameStateFactory().create();

        const gameView = new GameViewPO(gameState);

        expect(gameView.view()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).not.toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(gameState.game.currentPlayer);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is not the first player and default configurations in pc view", async () => {
        const gameState = new GameStateFactory().toOtherPlayerTurn().create();

        const gameView = new GameViewPO(gameState);

        expect(gameView.view()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).not.toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(gameState.game.players[0].name);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is the first player and no default configurations in pc view", async () => {
        const gameState = new GameStateFactory()
            .newConfig(["renda"], (val: number) => val+1)
            .newConfig(["moedasIniciais"], (val: number) => val+1)
            .newConfig(["ajudaExterna"], (val: number) => val-1)
            .create();

        const expectedConfigDiffs = [
            "Renda: 1 -> 2",
            "Moedas iniciais: 3 -> 4",
            "Ajuda externa: 2 -> 1"
        ];

        const gameView = new GameViewPO(gameState);

        expect(gameView.view()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).not.toBeInTheDocument();
        expect(gameView.nextPerson()).not.toBeInTheDocument();
        expect(gameView.configDiffs()).toBeInTheDocument();

        gameView.allConfigDiffTextContent().forEach(cd => {
            expect(expectedConfigDiffs.includes(cd as string)).toBe(true);
        });
    });

    it("should render correctly in the game beginning when player is the first player and default configurations in mobile view", async () => {
        const gameState = new GameStateFactory().create();

        const gameView = new GameViewPO(gameState, 500);

        expect(gameView.view()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(gameState.game.currentPlayer);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is not the first player and default configurations in mobile view", async () => {
        const gameState = new GameStateFactory().toOtherPlayerTurn().create();

        const gameView = new GameViewPO(gameState, 500);

        expect(gameView.view()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(gameState.game.players[0].name);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is the first player and no default configurations in mobile view", async () => {
        const gameState = new GameStateFactory()
            .newConfig(["ajudaExterna"], (val: number) => val-1)
            .newConfig(["moedasIniciais"], (val: number) => val+1)
            .newConfig(["renda"], (val: number) => val+1)
            .create();

        const expectedConfigDiffs = [
            "Ajuda externa: 2 -> 1",
            "Moedas iniciais: 3 -> 4",
            "Renda: 1 -> 2"
        ];

        const gameView = new GameViewPO(gameState, 500);

        expect(gameView.view()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).toBeInTheDocument();
        expect(gameView.nextPerson()).not.toBeInTheDocument();
        expect(gameView.configDiffs()).toBeInTheDocument();

        gameView.allConfigDiffTextContent().forEach(cd => {
            expect(expectedConfigDiffs.includes(cd as string)).toBe(true);
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

    it("should perform a ajuda externa action correctly", async () => {
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

        gameView.selectAjudaExterna();

        await waitFor(() => {
            expect(gameView.actionMenu()).not.toBeInTheDocument();
            expect(gameView.moneyMenu()).not.toBeInTheDocument();
        });

        expect(socketEmitMock).toHaveBeenCalledWith("ajudaExterna");
    });

    it("should perform a taxar action correctly when one card can perform it", async () => {
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

        gameView.selectTaxar();

        await waitFor(() => {
            expect(gameView.moneyMenu()).not.toBeInTheDocument();
            expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
            expect(gameView.cardPickingMenu()).toBeInTheDocument();
        });

        gameView.selectFirstPickableCard();

        await waitFor(() => {
            expect(gameView.actionMenu()).not.toBeInTheDocument();
            expect(gameView.cardPickingMenu()).not.toBeInTheDocument();
        });

        expect(socketEmitMock).toHaveBeenCalledWith("taxar", "duque", 0);
    });

    it("should perform a taxar action correctly when more than one card can perform it", async () => {
        const gameState = new GameStateFactory()
            .newConfig(["tiposCartas", "capitao", "taxar"], true)
            .create();

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

        gameView.selectTaxar();

        await waitFor(() => {
            expect(gameView.moneyMenu()).not.toBeInTheDocument();
            expect(gameView.cardChooserMenu()).toBeInTheDocument();
            expect(gameView.duqueChoosableCard()).toBeInTheDocument();
            expect(gameView.capitaoChoosableCard()).toBeInTheDocument();
        });

        gameView.selectDuqueChoosableCard();

        await waitFor(() => {
            expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
            expect(gameView.cardPickingMenu()).toBeInTheDocument();
        });

        gameView.selectFirstPickableCard();

        await waitFor(() => {
            expect(gameView.actionMenu()).not.toBeInTheDocument();
            expect(gameView.cardPickingMenu()).not.toBeInTheDocument();
        });

        expect(socketEmitMock).toHaveBeenCalledWith("taxar", "duque", 0);
    });

    it("should not perform a corrupcao action when there is no religion", async () => {
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

        gameView.selectCorrupcao();

        await waitFor(() => {
            expect(gameView.moneyMenu()).toBeInTheDocument();
            expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
            expect(gameView.cardPickingMenu()).not.toBeInTheDocument();
        });
    });

    it("should perform a corrupcao action correctly when one card can perform it", async () => {
        const gameState = new GameStateFactory()
            .newConfig(["religiao", "reforma"], true)
            .asylumCoins(1)
            .create();

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

        gameView.selectCorrupcao();

        await waitFor(() => {
            expect(gameView.moneyMenu()).not.toBeInTheDocument();
            expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
            expect(gameView.cardPickingMenu()).toBeInTheDocument();
        });

        gameView.selectFirstPickableCard();

        await waitFor(() => {
            expect(gameView.actionMenu()).not.toBeInTheDocument();
            expect(gameView.cardPickingMenu()).not.toBeInTheDocument();
        });

        expect(socketEmitMock).toHaveBeenCalledWith("corrupcao", "duque", 0);
    });

    it("should perform a taxar action correctly when more than one card can perform it", async () => {
        const gameState = new GameStateFactory()
            .newConfig(["religiao", "reforma"], true)
            .newConfig(["religiao", "cartasParaCorrupcao", "capitao"], true)
            .asylumCoins(1)
            .create();

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

        gameView.selectCorrupcao();

        await waitFor(() => {
            expect(gameView.moneyMenu()).not.toBeInTheDocument();
            expect(gameView.cardChooserMenu()).toBeInTheDocument();
            expect(gameView.duqueChoosableCard()).toBeInTheDocument();
            expect(gameView.capitaoChoosableCard()).toBeInTheDocument();
        });

        gameView.selectDuqueChoosableCard();

        await waitFor(() => {
            expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
            expect(gameView.cardPickingMenu()).toBeInTheDocument();
        });

        gameView.selectFirstPickableCard();

        await waitFor(() => {
            expect(gameView.actionMenu()).not.toBeInTheDocument();
            expect(gameView.cardPickingMenu()).not.toBeInTheDocument();
        });

        expect(socketEmitMock).toHaveBeenCalledWith("corrupcao", "duque", 0);
    });
});