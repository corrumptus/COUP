import { waitForElementToBeRemoved } from "@testing-library/dom";
import { Action, Card } from "@type/game";
import GameStateFactory from "@tests/GameStateFactory";
import GameViewPO from "@tests/GameViewPO";

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

        const player = gameState.player;
        const enemyPlayer = gameState.game.players[0];

        expect(gameView.view()).toBeInTheDocument();

        expect(gameView.leaveButton()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).not.toBeInTheDocument();

        expect(gameView.playerReligionButton()).not.toBeInTheDocument();

        expect(gameView.playerCard(enemyPlayer.name)).toBeInTheDocument();
        expect(gameView.religionButton(enemyPlayer.name)).not.toBeInTheDocument();
        expect(gameView.money(enemyPlayer.name)).toBeInTheDocument();
        expect(gameView.money(enemyPlayer.name)).toHaveTextContent(`${enemyPlayer.money}`);
        expect(gameView.extorquirButton(enemyPlayer.name)).toBeInTheDocument();
        expect(gameView.firstAttackableCard(enemyPlayer.name)).toBeInTheDocument();
        expect(gameView.firstAttackableCardType(enemyPlayer.name)).toBe("desconhecida");
        expect(gameView.secondAttackableCard(enemyPlayer.name)).toBeInTheDocument();
        expect(gameView.secondAttackableCardType(enemyPlayer.name)).toBe("desconhecida");

        expect(gameView.moneyButton()).toBeInTheDocument();
        expect(gameView.playerMoney()).toHaveTextContent(`${player.money}`);

        expect(gameView.firstInfluenceCard()).toBeInTheDocument();
        expect(gameView.firstInfluenceCardType()).toBe(player.cards[0].card);
        expect(gameView.secondInfluenceCard()).toBeInTheDocument();
        expect(gameView.secondInfluenceCardType()).toBe(player.cards[1].card);
        expect(gameView.changePlayerCardsButton()).toBeInTheDocument();

        expect(gameView.gameInfos()).toBeInTheDocument();

        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(player.name);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is not the first player and default configurations in pc view", async () => {
        const gameState = new GameStateFactory().toOtherPlayerTurn().create();

        const gameView = new GameViewPO(gameState);

        const enemyPlayer = gameState.game.players[0];

        expect(gameView.nextPerson()).toHaveTextContent(enemyPlayer.name);
    });

    it("should render correctly in the game beginning when no default configurations in pc view", async () => {
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

        expect(gameView.nextPerson()).not.toBeInTheDocument();
        expect(gameView.configDiffs()).toBeInTheDocument();

        gameView.allConfigDiffTextContent().forEach(cd => {
            expect(expectedConfigDiffs.includes(cd as string)).toBe(true);
        });
    });

    it("should render correctly when their is religion in pc view", () => {
        const gameState = new GameStateFactory()
            .newConfig(["religiao", "reforma"], true)
            .create();

        const gameView = new GameViewPO(gameState);

        const enemyPlayerName = gameState.game.players[0].name;

        expect(gameView.playerReligionButton()).toBeInTheDocument();

        expect(gameView.religionButton(enemyPlayerName)).toBeInTheDocument();

        expect(gameView.configDiffs()).toBeInTheDocument();
    });

    it("should close next person when default configs in pc view", async () => {
        const gameState = new GameStateFactory().create();

        const gameView = new GameViewPO(gameState);

        await gameView.closeNextPerson();

        expect(gameView.nextPerson()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is the first player and default configurations in mobile view", async () => {
        const gameState = new GameStateFactory().create();

        const gameView = new GameViewPO(gameState, 500);

        const player = gameState.player;
        const enemyPlayer = gameState.game.players[0];

        expect(gameView.view()).toBeInTheDocument();

        expect(gameView.leaveButton()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).toBeInTheDocument();

        expect(gameView.playerReligionButton()).not.toBeInTheDocument();

        expect(gameView.playerCard(enemyPlayer.name)).toBeInTheDocument();
        expect(gameView.religionButton(enemyPlayer.name)).not.toBeInTheDocument();
        expect(gameView.money(enemyPlayer.name)).toBeInTheDocument();
        expect(gameView.money(enemyPlayer.name)).toHaveTextContent(`${enemyPlayer.money}`);
        expect(gameView.extorquirButton(enemyPlayer.name)).toBeInTheDocument();
        expect(gameView.firstAttackableCard(enemyPlayer.name)).toBeInTheDocument();
        expect(gameView.firstAttackableCardType(enemyPlayer.name)).toBe("desconhecida");
        expect(gameView.secondAttackableCard(enemyPlayer.name)).toBeInTheDocument();
        expect(gameView.secondAttackableCardType(enemyPlayer.name)).toBe("desconhecida");

        expect(gameView.moneyButton()).toBeInTheDocument();
        expect(gameView.playerMoney()).toHaveTextContent(`${player.money}`);

        expect(gameView.firstInfluenceCard()).toBeInTheDocument();
        expect(gameView.firstInfluenceCardType()).toBe(player.cards[0].card);
        expect(gameView.secondInfluenceCard()).toBeInTheDocument();
        expect(gameView.secondInfluenceCardType()).toBe(player.cards[1].card);
        expect(gameView.changePlayerCardsButton()).toBeInTheDocument();

        expect(gameView.gameInfos()).toBeInTheDocument();

        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(player.name);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is not the first player and default configurations in mobile view", async () => {
        const gameState = new GameStateFactory().toOtherPlayerTurn().create();

        const gameView = new GameViewPO(gameState, 500);

        const enemyPlayer = gameState.game.players[0];

        expect(gameView.nextPerson()).toHaveTextContent(enemyPlayer.name);
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

        expect(gameView.nextPerson()).not.toBeInTheDocument();
        expect(gameView.configDiffs()).toBeInTheDocument();

        gameView.allConfigDiffTextContent().forEach(cd => {
            expect(expectedConfigDiffs.includes(cd as string)).toBe(true);
        });
    });

    it("should render correctly when their is religion in mobile view", () => {
        const gameState = new GameStateFactory()
            .newConfig(["religiao", "reforma"], true)
            .create();

        const gameView = new GameViewPO(gameState, 500);

        const enemyPlayerName = gameState.game.players[0].name;

        expect(gameView.playerReligionButton()).toBeInTheDocument();

        expect(gameView.religionButton(enemyPlayerName)).toBeInTheDocument();

        expect(gameView.configDiffs()).toBeInTheDocument();
    });

    it("should close next person when default configs in mobile view", async () => {
        const gameState = new GameStateFactory().create();

        const gameView = new GameViewPO(gameState, 500);

        await gameView.closeNextPerson();

        expect(gameView.nextPerson()).not.toBeInTheDocument();
    });
});

describe("Game View interactivity for game actions", () => {
    async function initializeView(
        configFactory: (factory: GameStateFactory) => GameStateFactory = factory => factory
    ) {
        const gameState = configFactory(new GameStateFactory()).create();

        const gameView = new GameViewPO(gameState);

        if (gameView.configDiffs() !== null)
            await waitForElementToBeRemoved(gameView.configDiffs(), { timeout: 5000 });

        await gameView.closeNextPerson();

        return {
            gameState,
            gameView,
            enemyPlayerName: gameState.game.players[0].name
        };
    }

    it("should perform a renda action correctly", async () => {
        const { gameView } = await initializeView();

        await gameView.openMoneyMenu();

        expect(gameView.moneyMenu()).toBeInTheDocument();

        await gameView.selectRenda();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("renda");
    });

    it("should perform a ajuda externa action correctly", async () => {
        const { gameView } = await initializeView();

        await gameView.openMoneyMenu();

        expect(gameView.moneyMenu()).toBeInTheDocument();

        await gameView.selectAjudaExterna();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("ajudaExterna");
    });

    it("should perform a taxar action correctly when one card can perform it", async () => {
        const { gameView } = await initializeView();

        await gameView.openMoneyMenu();

        expect(gameView.moneyMenu()).toBeInTheDocument();

        await gameView.selectTaxar();

        expect(gameView.moneyMenu()).not.toBeInTheDocument();
        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("taxar", "duque", 0);
    });

    it("should perform a taxar action correctly when more than one card can perform it", async () => {
        const { gameView } = await initializeView(factory => factory
            .newConfig(["tiposCartas", "capitao", "taxar"], true)
        );

        await gameView.openMoneyMenu();

        expect(gameView.moneyMenu()).toBeInTheDocument();

        await gameView.selectTaxar();

        expect(gameView.moneyMenu()).not.toBeInTheDocument();
        expect(gameView.cardChooserMenu()).toBeInTheDocument();
        expect(gameView.duqueChoosableCard()).toBeInTheDocument();
        expect(gameView.capitaoChoosableCard()).toBeInTheDocument();

        await gameView.selectCapitaoChoosableCard();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("taxar", "capitao", 0);
    });

    it("should not perform a corrupcao action when there is no religion", async () => {
        const { gameView } = await initializeView();

        await gameView.openMoneyMenu();

        expect(gameView.moneyMenu()).toBeInTheDocument();

        await gameView.selectCorrupcao();

        expect(gameView.moneyMenu()).toBeInTheDocument();
        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();
    });

    it("should not perform a corrupcao action when there is no money in asylum", async () => {
        const { gameView } = await initializeView(factory => factory
            .newConfig(["religiao", "reforma"], true)
        );

        await gameView.openMoneyMenu();

        expect(gameView.moneyMenu()).toBeInTheDocument();

        await gameView.selectCorrupcao();

        expect(gameView.moneyMenu()).toBeInTheDocument();
        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();
    });

    it("should perform a corrupcao action correctly when one card can perform it", async () => {
        const { gameView } = await initializeView(factory => factory
            .newConfig(["religiao", "reforma"], true)
            .asylumCoins(1)
        );

        await gameView.openMoneyMenu();

        expect(gameView.moneyMenu()).toBeInTheDocument();

        await gameView.selectCorrupcao();

        expect(gameView.moneyMenu()).not.toBeInTheDocument();
        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("corrupcao", "duque", 0);
    });

    it("should perform a corrupcao action correctly when more than one card can perform it", async () => {
        const { gameView } = await initializeView(factory => factory
            .newConfig(["religiao", "reforma"], true)
            .newConfig(["religiao", "cartasParaCorrupcao", "capitao"], true)
            .asylumCoins(1)
        );

        await gameView.openMoneyMenu();

        expect(gameView.moneyMenu()).toBeInTheDocument();

        await gameView.selectCorrupcao();

        expect(gameView.moneyMenu()).not.toBeInTheDocument();
        expect(gameView.cardChooserMenu()).toBeInTheDocument();
        expect(gameView.duqueChoosableCard()).toBeInTheDocument();
        expect(gameView.capitaoChoosableCard()).toBeInTheDocument();

        await gameView.selectCapitaoChoosableCard();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("corrupcao", "capitao", 0);
    });

    it("should perform a extorquir action correctly when one card can perform it", async () => {
        const { enemyPlayerName, gameView } = await initializeView();

        await gameView.extorquir(enemyPlayerName);

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("extorquir", "capitao", 0, enemyPlayerName);
    });

    it("should perform a extorquir action correctly when more than one card can perform it", async () => {
        const { enemyPlayerName, gameView } = await initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "extorquir"], true)
        );

        await gameView.extorquir(enemyPlayerName);

        expect(gameView.cardChooserMenu()).toBeInTheDocument();
        expect(gameView.duqueChoosableCard()).toBeInTheDocument();
        expect(gameView.capitaoChoosableCard()).toBeInTheDocument();

        await gameView.selectDuqueChoosableCard();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("extorquir", "duque", 0, enemyPlayerName);
    });

    it("should perform a assassinar action correctly when one card can perform it", async () => {
        const { enemyPlayerName, gameView } = await initializeView();

        await gameView.attackFistCard(enemyPlayerName);

        expect(gameView.attackMenu()).toBeInTheDocument();

        await gameView.assassinar();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("assassinar", "assassino", 0, enemyPlayerName, 0);
    });

    it("should perform a assassinar action correctly when more than one card can perform it", async () => {
        const { enemyPlayerName, gameView } = await initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "assassinar"], true)
        );

        await gameView.attackFistCard(enemyPlayerName);

        expect(gameView.attackMenu()).toBeInTheDocument();

        await gameView.assassinar();

        expect(gameView.cardChooserMenu()).toBeInTheDocument();
        expect(gameView.duqueChoosableCard()).toBeInTheDocument();
        expect(gameView.assassinoChoosableCard()).toBeInTheDocument();

        await gameView.selectDuqueChoosableCard();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("assassinar", "duque", 0, enemyPlayerName, 0);
    });

    it("should perform a investigar action correctly when one card can perform it", async () => {
        const { enemyPlayerName, gameView } = await initializeView();

        await gameView.attackFistCard(enemyPlayerName);

        expect(gameView.attackMenu()).toBeInTheDocument();

        await gameView.investigar();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("investigar", "inquisidor", 0, enemyPlayerName, 0);
    });

    it("should perform a investigar action correctly when more than one card can perform it", async () => {
        const { enemyPlayerName, gameView } = await initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "investigar"], true)
        );

        await gameView.attackFistCard(enemyPlayerName);

        expect(gameView.attackMenu()).toBeInTheDocument();

        await gameView.investigar();

        expect(gameView.cardChooserMenu()).toBeInTheDocument();
        expect(gameView.duqueChoosableCard()).toBeInTheDocument();
        expect(gameView.inquisidorChoosableCard()).toBeInTheDocument();

        await gameView.selectDuqueChoosableCard();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("investigar", "duque", 0, enemyPlayerName, 0);
    });

    it("should not perform a golpe de estado action when their is no enough money", async () => {
        const { enemyPlayerName, gameView } = await initializeView();

        await gameView.attackFistCard(enemyPlayerName);

        expect(gameView.attackMenu()).toBeInTheDocument();

        await gameView.golpeEstado();

        expect(gameView.attackMenu()).toBeInTheDocument();
    });

    it("should perform a golpe de estado action correctly", async () => {
        const { enemyPlayerName, gameView } = await initializeView(factory => factory
            .newConfig(["moedasIniciais"], 7)
        );

        await gameView.attackFistCard(enemyPlayerName);

        expect(gameView.attackMenu()).toBeInTheDocument();

        await gameView.golpeEstado();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("golpeEstado", enemyPlayerName, 0);
    });

    it("should not perform a self trocar religiao action when their is no enough money", async () => {
        const { gameView } = await initializeView(factory => factory
            .newConfig(["religiao", "reforma"], true)
            .newConfig(["moedasIniciais"], 0)
        );

        await gameView.changePlayerReligion();

        expect(socketEmitMock).not.toHaveBeenCalledWith("trocarPropriaReligiao");
    });

    it("should perform a self trocar religiao action correctly", async () => {
        const { gameView } = await initializeView(factory => factory
            .newConfig(["religiao", "reforma"], true)
        );

        await gameView.changePlayerReligion();

        expect(socketEmitMock).toHaveBeenCalledWith("trocarPropriaReligiao");
    });

    it("should not perform a trocar religiao action when their is no enough money", async () => {
        const { enemyPlayerName, gameView } = await initializeView(factory => factory
            .newConfig(["religiao", "reforma"], true)
            .newConfig(["moedasIniciais"], 1)
        );

        await gameView.changeReligion(enemyPlayerName);

        expect(socketEmitMock).not.toHaveBeenCalledWith("trocarReligiaoOutro", enemyPlayerName);
    });

    it("should perform a trocar religiao action correctly", async () => {
        const { enemyPlayerName, gameView } = await initializeView(factory => factory
            .newConfig(["religiao", "reforma"], true)
        );

        await gameView.changeReligion(enemyPlayerName);

        expect(socketEmitMock).toHaveBeenCalledWith("trocarReligiaoOutro", enemyPlayerName);
    });
});

describe("Game View render in game update", () => {
    function initializeView(
        configFactory: (factory: GameStateFactory) => GameStateFactory = factory => factory
    ) {
        const gameState = configFactory(new GameStateFactory()).create();

        const gameView = new GameViewPO(gameState);

        return {
            gameState,
            gameView,
            enemyPlayerName: gameState.game.players[0].name,
            playerName: gameState.player.name
        };
    }

    it("should render correctly when a player uses renda", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.RENDA, undefined, undefined, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0]).toBe(`O player ${enemyPlayerName} pediu renda`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses ajuda externa", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.AJUDA_EXTERNA, undefined, undefined, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} pediu ajuda externa`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses ajuda externa when no card can block it", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "taxar"], false)
            .ofSeeingEnemy(Action.AJUDA_EXTERNA, undefined, undefined, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} pediu ajuda externa`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses taxar", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.TAXAR, Card.DUQUE, undefined, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} taxou o banco com ${Card.DUQUE}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses taxar and a card can block it", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "capitao", "bloquearTaxar"], true)
            .ofSeeingEnemy(Action.TAXAR, Card.DUQUE, undefined, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} taxou o banco com ${Card.DUQUE}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses corrupcao", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.CORRUPCAO, Card.DUQUE, undefined, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} se corrompeu com ${Card.DUQUE}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses extorquir", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.EXTORQUIR, Card.CAPITAO, undefined, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} extorquiu ${playerName} com ${Card.CAPITAO}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses extorquir when no card can block it", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .newConfig(["tiposCartas", "capitao", "bloquearExtorquir"], false)
            .newConfig(["tiposCartas", "embaixador", "bloquearExtorquir"], false)
            .newConfig(["tiposCartas", "inquisidor", "bloquearExtorquir"], false)
            .ofSeeingEnemy(Action.EXTORQUIR, Card.CAPITAO, undefined, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} extorquiu ${playerName} com ${Card.CAPITAO}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses assassinar", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.ASSASSINAR, Card.ASSASSINO, 0, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} assassinou uma carta de ${playerName} com ${Card.ASSASSINO}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses assassinar when no card can block it", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .newConfig(["tiposCartas", "condessa", "bloquearAssassinar"], false)
            .ofSeeingEnemy(Action.ASSASSINAR, Card.ASSASSINO, 0, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} assassinou uma carta de ${playerName} com ${Card.ASSASSINO}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses investigar", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.INVESTIGAR, Card.INQUISIDOR, 0, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} quer investigar uma carta de ${playerName} com ${Card.INQUISIDOR}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses investigar and a card can block it", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearInvestigar"], true)
            .ofSeeingEnemy(Action.INVESTIGAR, Card.INQUISIDOR, 0, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} quer investigar uma carta de ${playerName} com ${Card.INQUISIDOR}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses golpe de estado", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.GOLPE_ESTADO, undefined, 0, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} deu um golpe de estado em ${playerName}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses trocar with a card that can change all cards", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.TROCAR, Card.EMBAIXADOR, undefined, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou as cartas com ${Card.EMBAIXADOR}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses trocar with a card that can change all cards and a card can block it", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTrocar"], true)
            .ofSeeingEnemy(Action.TROCAR, Card.EMBAIXADOR, undefined, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou as cartas com ${Card.EMBAIXADOR}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses trocar with a card that can change only one card", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.TROCAR, Card.INQUISIDOR, 0, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou a 1º carta com ${Card.INQUISIDOR}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses trocar with a card that can change only one card and a card can block it", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTrocar"], true)
            .ofSeeingEnemy(Action.TROCAR, Card.INQUISIDOR, 0, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou a 1º carta com ${Card.INQUISIDOR}`);
        expect(gameView.gameUpdateToasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.gameUpdateToasterContestButtons()[0]).toBeInTheDocument();
    });
});