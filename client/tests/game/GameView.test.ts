import { waitForElementToBeRemoved } from "@testing-library/dom";
import { Action, Card } from "@type/game";
import GameStateBuilder from "@tests/GameStateBuilder";
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
        const gameState = new GameStateBuilder().create();

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
        const gameState = new GameStateBuilder().toOtherPlayerTurn().create();

        const gameView = new GameViewPO(gameState);

        const enemyPlayer = gameState.game.players[0];

        expect(gameView.nextPerson()).toHaveTextContent(enemyPlayer.name);
    });

    it("should render correctly in the game beginning when no default configurations in pc view", async () => {
        const gameState = new GameStateBuilder()
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
        const gameState = new GameStateBuilder()
            .newConfig(["religiao", "reforma"], true)
            .create();

        const gameView = new GameViewPO(gameState);

        const enemyPlayerName = gameState.game.players[0].name;

        expect(gameView.playerReligionButton()).toBeInTheDocument();

        expect(gameView.religionButton(enemyPlayerName)).toBeInTheDocument();

        expect(gameView.configDiffs()).toBeInTheDocument();
    });

    it("should close next person when default configs in pc view", async () => {
        const gameState = new GameStateBuilder().create();

        const gameView = new GameViewPO(gameState);

        await gameView.closeNextPerson();

        expect(gameView.nextPerson()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is the first player and default configurations in mobile view", async () => {
        const gameState = new GameStateBuilder().create();

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
        const gameState = new GameStateBuilder().toOtherPlayerTurn().create();

        const gameView = new GameViewPO(gameState, 500);

        const enemyPlayer = gameState.game.players[0];

        expect(gameView.nextPerson()).toHaveTextContent(enemyPlayer.name);
    });

    it("should render correctly in the game beginning when player is the first player and no default configurations in mobile view", async () => {
        const gameState = new GameStateBuilder()
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
        const gameState = new GameStateBuilder()
            .newConfig(["religiao", "reforma"], true)
            .create();

        const gameView = new GameViewPO(gameState, 500);

        const enemyPlayerName = gameState.game.players[0].name;

        expect(gameView.playerReligionButton()).toBeInTheDocument();

        expect(gameView.religionButton(enemyPlayerName)).toBeInTheDocument();

        expect(gameView.configDiffs()).toBeInTheDocument();
    });

    it("should close next person when default configs in mobile view", async () => {
        const gameState = new GameStateBuilder().create();

        const gameView = new GameViewPO(gameState, 500);

        await gameView.closeNextPerson();

        expect(gameView.nextPerson()).not.toBeInTheDocument();
    });
});

describe("Game View interactivity for game actions", () => {
    async function initializeView(
        configFactory: (factory: GameStateBuilder) => GameStateBuilder = factory => factory
    ) {
        const gameState = configFactory(new GameStateBuilder()).create();

        const gameView = new GameViewPO(gameState);

        if (gameView.configDiffs() !== null)
            await waitForElementToBeRemoved(gameView.configDiffs(), { timeout: 5000 });

        await gameView.closeNextPerson();

        return {
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

    it("should prevent player changing self religion when may do a golpe de estado", async () => {
        const { gameView } = await initializeView(factory => factory
            .newConfig(["religiao", "reforma"], true)
            .newConfig(["moedasIniciais"], 10)
        );

        await gameView.changePlayerReligion();

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.allToastersChildrenContents()[0])
            .toBe("Você só pode dar golpe de estado neste turno");
    });

    it("should prevent player changing enemy religion menu when may do a golpe de estado", async () => {
        const { gameView, enemyPlayerName } = await initializeView(factory => factory
            .newConfig(["religiao", "reforma"], true)
            .newConfig(["moedasIniciais"], 10)
        );

        await gameView.changeReligion(enemyPlayerName);

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.allToastersChildrenContents()[0])
            .toBe("Você só pode dar golpe de estado neste turno");
    });

    it("should prevent player using extorquir when may do a golpe de estado", async () => {
        const { gameView, enemyPlayerName } = await initializeView(factory => factory
            .newConfig(["moedasIniciais"], 10)
        );

        await gameView.extorquir(enemyPlayerName);

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.allToastersChildrenContents()[0])
            .toBe("Você só pode dar golpe de estado neste turno");
    });

    it("should prevent player using assassinar when may do a golpe de estado", async () => {
        const { gameView, enemyPlayerName } = await initializeView(factory => factory
            .newConfig(["moedasIniciais"], 10)
        );

        await gameView.attackFistCard(enemyPlayerName);

        await gameView.assassinar();

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.allToastersChildrenContents()[0])
            .toBe("Você só pode dar golpe de estado neste turno");
    });

    it("should prevent player using investigar when may do a golpe de estado", async () => {
        const { gameView, enemyPlayerName } = await initializeView(factory => factory
            .newConfig(["moedasIniciais"], 10)
        );

        await gameView.attackFistCard(enemyPlayerName);

        await gameView.investigar();

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.allToastersChildrenContents()[0])
            .toBe("Você só pode dar golpe de estado neste turno");
    });

    it("should prevent player going to the money menu when may do a golpe de estado", async () => {
        const { gameView } = await initializeView(factory => factory
            .newConfig(["moedasIniciais"], 10)
        );

        await gameView.openMoneyMenu();

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.allToastersChildrenContents()[0])
            .toBe("Você só pode dar golpe de estado neste turno");
    });

    it("should prevent player using trocar when may do a golpe de estado", async () => {
        const { gameView } = await initializeView(factory => factory
            .newConfig(["moedasIniciais"], 10)
        );

        await gameView.changePlayerCards();

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.allToastersChildrenContents()[0])
            .toBe("Você só pode dar golpe de estado neste turno");
    });

    it("should perfom a golpe de estado when may do a golpe de estado", async () => {
        const { gameView, enemyPlayerName } = await initializeView(factory => factory
            .newConfig(["moedasIniciais"], 10)
        );

        await gameView.attackFistCard(enemyPlayerName);

        await gameView.golpeEstado();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("golpeEstado", enemyPlayerName, 0);
    });

    it("should perform a trocar after investigar", async () => {
        const { gameView, enemyPlayerName } = await initializeView(factory => factory
            .ofInvestigating(Card.INQUISIDOR, 0, Card.DUQUE, 0)
        );

        await gameView.change();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock)
            .toHaveBeenCalledWith("trocar", Card.INQUISIDOR, 0, enemyPlayerName, 0);
    });

    it("should perform a continuar after investigar", async () => {
        const { gameView } = await initializeView(factory => factory
            .ofInvestigating(Card.INQUISIDOR, 0, Card.DUQUE, 0)
        );

        await gameView.keep();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock)
            .toHaveBeenCalledWith("continuar");
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
        configFactory: (factory: GameStateBuilder) => GameStateBuilder = factory => factory
    ) {
        const gameState = configFactory(new GameStateBuilder()).create();

        const gameView = new GameViewPO(gameState);

        return {
            gameView,
            enemyPlayerName: gameState.game.players[0].name,
            playerName: gameState.player.name
        };
    }

    it("should render correctly when a player uses renda", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.RENDA, undefined, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0]).toBe(`O player ${enemyPlayerName} pediu renda`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses ajuda externa", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.AJUDA_EXTERNA, undefined, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} pediu ajuda externa`);
        expect(gameView.toasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.toasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses ajuda externa when no card can block it", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "taxar"], false)
            .ofSeeingEnemy(Action.AJUDA_EXTERNA, undefined, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} pediu ajuda externa`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses taxar", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.TAXAR, Card.DUQUE, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} taxou o banco com ${Card.DUQUE}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses taxar and a card can block it", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "capitao", "bloquearTaxar"], true)
            .ofSeeingEnemy(Action.TAXAR, Card.DUQUE, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} taxou o banco com ${Card.DUQUE}`);
        expect(gameView.toasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses corrupcao", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.CORRUPCAO, Card.DUQUE, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} se corrompeu com ${Card.DUQUE}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses extorquir", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.EXTORQUIR, Card.CAPITAO, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} extorquiu ${playerName} com ${Card.CAPITAO}`);
        expect(gameView.toasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses extorquir when no card can block it", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .newConfig(["tiposCartas", "capitao", "bloquearExtorquir"], false)
            .newConfig(["tiposCartas", "embaixador", "bloquearExtorquir"], false)
            .newConfig(["tiposCartas", "inquisidor", "bloquearExtorquir"], false)
            .ofSeeingEnemy(Action.EXTORQUIR, Card.CAPITAO, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} extorquiu ${playerName} com ${Card.CAPITAO}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses assassinar", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.ASSASSINAR, Card.ASSASSINO, 0, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} assassinou uma carta de ${playerName} com ${Card.ASSASSINO}`);
        expect(gameView.toasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses assassinar when no card can block it", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .newConfig(["tiposCartas", "condessa", "bloquearAssassinar"], false)
            .ofSeeingEnemy(Action.ASSASSINAR, Card.ASSASSINO, 0, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} assassinou uma carta de ${playerName} com ${Card.ASSASSINO}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses investigar", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.INVESTIGAR, Card.INQUISIDOR, 0, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} quer investigar uma carta de ${playerName} com ${Card.INQUISIDOR}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses investigar and a card can block it", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearInvestigar"], true)
            .ofSeeingEnemy(Action.INVESTIGAR, Card.INQUISIDOR, 0, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} quer investigar uma carta de ${playerName} com ${Card.INQUISIDOR}`);
        expect(gameView.toasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses golpe de estado", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.GOLPE_ESTADO, undefined, 0, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} deu um golpe de estado em ${playerName}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses trocar with a card that can change all cards", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.TROCAR, Card.EMBAIXADOR, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou as cartas com ${Card.EMBAIXADOR}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses trocar with a card that can change all cards and a card can block it", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTrocar"], true)
            .ofSeeingEnemy(Action.TROCAR, Card.EMBAIXADOR, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou as cartas com ${Card.EMBAIXADOR}`);
        expect(gameView.toasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses trocar with a card that can change only one card", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.TROCAR, Card.INQUISIDOR, 0, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou a 1º carta com ${Card.INQUISIDOR}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses trocar with a card that can change only one card and a card can block it", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTrocar"], true)
            .ofSeeingEnemy(Action.TROCAR, Card.INQUISIDOR, 0, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou a 1º carta com ${Card.INQUISIDOR}`);
        expect(gameView.toasterBlockButtons()[0]).toBeInTheDocument();
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses trocar after a investigar", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.TROCAR, Card.INQUISIDOR, 0, true, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou a 1º carta de ${playerName}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses continuar after a investigar", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.CONTINUAR, undefined, undefined, true, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} não trocou a carta de ${playerName}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses self trocar religiao", () => {
        const { enemyPlayerName, gameView } = initializeView(factory => factory
            .ofSeeingEnemy(Action.TROCAR_PROPRIA_RELIGIAO, undefined, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou a própria religião`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses trocar religiao", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.TROCAR_RELIGIAO_OUTRO, undefined, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} trocou a religião de ${playerName}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses bloquear", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.BLOQUEAR, Card.DUQUE, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} bloqueou ${playerName} com ${Card.DUQUE}`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBeInTheDocument();
    });

    it("should render correctly when a player uses contestar and win", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.CONTESTAR, undefined, undefined, false, true)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} contestou ${playerName} e venceu`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player uses contestar and lose", () => {
        const { enemyPlayerName, gameView, playerName } = initializeView(factory => factory
            .ofSeeingEnemy(Action.CONTESTAR, undefined, undefined, false, false)
        );

        expect(gameView.alltoasters().length).toBe(1);

        expect(gameView.alltoasters()[0]).toBeInTheDocument();
        expect(gameView.toasterContents()[0])
            .toBe(`O player ${enemyPlayerName} contestou ${playerName} e perdeu`);
        expect(gameView.toasterBlockButtons()[0]).toBe(undefined);
        expect(gameView.toasterContestButtons()[0]).toBe(undefined);
    });

    it("should render correctly when a player attack with extorquir", () => {
        const { gameView } = initializeView(factory => factory
            .ofBeingAttacked(Action.EXTORQUIR, Card.CAPITAO, undefined, undefined)
        );

        expect(gameView.defenseMenu()).toBeInTheDocument();
        expect(gameView.blockButton()).toBeInTheDocument();
        expect(gameView.contestButton()).toBeInTheDocument();
        expect(gameView.acceptButton()).toBeInTheDocument();
    });

    it("should render correctly when a player attack with assassinar", () => {
        const { gameView } = initializeView(factory => factory
            .ofBeingAttacked(Action.ASSASSINAR, Card.ASSASSINO, 0, undefined)
        );

        expect(gameView.defenseMenu()).toBeInTheDocument();
        expect(gameView.blockButton()).toBeInTheDocument();
        expect(gameView.contestButton()).toBeInTheDocument();
        expect(gameView.acceptButton()).toBeInTheDocument();
    });

    it("should render correctly when a player attack with investigar", () => {
        const { gameView } = initializeView(factory => factory
            .ofBeingAttacked(Action.INVESTIGAR, Card.INQUISIDOR, 0, undefined)
        );

        expect(gameView.defenseMenu()).toBeInTheDocument();
        expect(gameView.blockButton()).toBeInTheDocument();
        expect(gameView.contestButton()).toBeInTheDocument();
        expect(gameView.acceptButton()).toBeInTheDocument();
    });

    it("should render correctly when a player attack with bloquear after a ajuda externa", () => {
        const { gameView } = initializeView(factory => factory
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.AJUDA_EXTERNA)
        );

        expect(gameView.blockDefenseMenu()).toBeInTheDocument();
        expect(gameView.contestButton()).toBeInTheDocument();
        expect(gameView.acceptButton()).toBeInTheDocument();
    });

    it("should render correctly when a player attack with bloquear after a taxar", () => {
        const { gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTaxar"], true)
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.TAXAR)
        );

        expect(gameView.blockDefenseMenu()).toBeInTheDocument();
        expect(gameView.contestButton()).toBeInTheDocument();
        expect(gameView.acceptButton()).toBeInTheDocument();
    });

    it("should render correctly when a player attack with bloquear after a extorquir", () => {
        const { gameView } = initializeView(factory => factory
            .ofBeingAttacked(Action.BLOQUEAR, Card.CAPITAO, undefined, Action.EXTORQUIR)
        );

        expect(gameView.blockDefenseMenu()).toBeInTheDocument();
        expect(gameView.contestButton()).toBeInTheDocument();
        expect(gameView.acceptButton()).toBeInTheDocument();
    });

    it("should render correctly when a player attack with bloquear after a assassinar", () => {
        const { gameView } = initializeView(factory => factory
            .ofBeingAttacked(Action.BLOQUEAR, Card.CONDESSA, undefined, Action.ASSASSINAR)
        );

        expect(gameView.blockDefenseMenu()).toBeInTheDocument();
        expect(gameView.contestButton()).toBeInTheDocument();
        expect(gameView.acceptButton()).toBeInTheDocument();
    });

    it("should render correctly when a player attack with bloquear after a investigar", () => {
        const { gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearInvestigar"], true)
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.INVESTIGAR)
        );

        expect(gameView.blockDefenseMenu()).toBeInTheDocument();
        expect(gameView.contestButton()).toBeInTheDocument();
        expect(gameView.acceptButton()).toBeInTheDocument();
    });

    it("should render correctly when a player attack with bloquear after a trocar", () => {
        const { gameView } = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTrocar"], true)
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.TROCAR)
        );

        expect(gameView.blockDefenseMenu()).toBeInTheDocument();
        expect(gameView.contestButton()).toBeInTheDocument();
        expect(gameView.acceptButton()).toBeInTheDocument();
    });

    it("should render correctly when a player investigate", () => {
        const { gameView } = initializeView(factory => factory
            .ofInvestigating(Card.INQUISIDOR, 0, Card.DUQUE, 0)
        );

        expect(gameView.investigatingMenu()).toBeInTheDocument();
        expect(gameView.investigatedCard()).toBeInTheDocument();
        expect(gameView.investigatedCardType()).toBe("duque");
        expect(gameView.changeButton()).toBeInTheDocument();
        expect(gameView.keepButton()).toBeInTheDocument();
    });
});

describe("Game View interactivity in post game update when observing", () => {
    function initializeView(
        configFactory: (factory: GameStateBuilder) => GameStateBuilder = factory => factory
    ) {
        const gameState = configFactory(new GameStateBuilder()).create();

        const gameView = new GameViewPO(gameState);

        return gameView;
    }

    it("should render correctly when using bloquear after ajuda externa when one card can block it", async () => {
        const gameView = initializeView(factory => factory
            .ofSeeingEnemy(Action.AJUDA_EXTERNA, undefined, undefined, false, false)
        );

        await gameView.blockByToaster(0);

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "duque", 0);
    });

    it("should render correctly when using bloquear after ajuda externa when more than one card can block it", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "capitao", "taxar"], true)
            .ofSeeingEnemy(Action.AJUDA_EXTERNA, undefined, undefined, false, false)
        );

        await gameView.blockByToaster(0);

        expect(gameView.cardChooserMenu()).toBeInTheDocument();

        await gameView.selectCapitaoChoosableCard();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "capitao", 0);
    });

    it("should render correctly when using bloquear after taxar when one card can block it", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTaxar"], true)
            .ofSeeingEnemy(Action.TAXAR, Card.DUQUE, undefined, false, false)
        );

        await gameView.blockByToaster(0);

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "duque", 0);
    });

    it("should render correctly when using bloquear after taxar when more than one card can block it", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTaxar"], true)
            .newConfig(["tiposCartas", "capitao", "bloquearTaxar"], true)
            .ofSeeingEnemy(Action.TAXAR, Card.DUQUE, undefined, false, false)
        );

        await gameView.blockByToaster(0);

        expect(gameView.cardChooserMenu()).toBeInTheDocument();

        await gameView.selectCapitaoChoosableCard();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "capitao", 0);
    });

    it("should render correctly when using bloquear after extorquir when one card can block it", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "embaixador", "bloquearExtorquir"], false)
            .newConfig(["tiposCartas", "inquisidor", "bloquearExtorquir"], false)
            .ofSeeingEnemy(Action.EXTORQUIR, Card.CAPITAO, undefined, false, false)
        );

        await gameView.blockByToaster(0);

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "capitao", 0);
    });

    it("should render correctly when using bloquear after extorquir when more than one card can block it", async () => {
        const gameView = initializeView(factory => factory
            .ofSeeingEnemy(Action.EXTORQUIR, Card.CAPITAO, undefined, false, false)
        );

        await gameView.blockByToaster(0);

        expect(gameView.cardChooserMenu()).toBeInTheDocument();

        await gameView.selectEmbaixadorChoosableCard();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "embaixador", 0);
    });

    it("should render correctly when using bloquear after assassinar", async () => {
        const gameView = initializeView(factory => factory
            .ofSeeingEnemy(Action.ASSASSINAR, Card.ASSASSINO, 0, false, false)
        );

        await gameView.blockByToaster(0);

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "condessa");
    });

    it("should render correctly when using bloquear after investigar", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearInvestigar"], true)
            .ofSeeingEnemy(Action.INVESTIGAR, Card.INQUISIDOR, 0, false, false)
        );

        await gameView.blockByToaster(0);

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "duque");
    });

    it("should render correctly when using bloquear after trocar when one card can block it", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTrocar"], true)
            .ofSeeingEnemy(Action.TROCAR, Card.EMBAIXADOR, undefined, false, false)
        );

        await gameView.blockByToaster(0);

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "duque", 0);
    });

    it("should render correctly when using bloquear after trocar when more than one card can block it", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTrocar"], true)
            .newConfig(["tiposCartas", "capitao", "bloquearTrocar"], true)
            .ofSeeingEnemy(Action.EXTORQUIR, Card.EMBAIXADOR, undefined, false, false)
        );

        await gameView.blockByToaster(0);

        expect(gameView.cardChooserMenu()).toBeInTheDocument();

        await gameView.selectCapitaoChoosableCard();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "capitao", 0);
    });

    it("should render correctly when using contestar after taxar", async () => {
        const gameView = initializeView(factory => factory
            .ofSeeingEnemy(Action.TAXAR, Card.DUQUE, undefined, false, false)
        );

        await gameView.contestByToaster(0);

        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar", 0);
    });

    it("should render correctly when using contestar after corrupcao", async () => {
        const gameView = initializeView(factory => factory
            .ofSeeingEnemy(Action.CORRUPCAO, Card.DUQUE, undefined, false, false)
        );

        await gameView.contestByToaster(0);

        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar", 0);
    });

    it("should render correctly when using contestar after extorquir", async () => {
        const gameView = initializeView(factory => factory
            .ofSeeingEnemy(Action.EXTORQUIR, Card.CAPITAO, undefined, false, false)
        );

        await gameView.contestByToaster(0);

        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar", 0);
    });

    it("should render correctly when using contestar after assassinar", async () => {
        const gameView = initializeView(factory => factory
            .ofSeeingEnemy(Action.ASSASSINAR, Card.ASSASSINO, 0, false, false)
        );

        await gameView.contestByToaster(0);

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar");
    });

    it("should render correctly when using contestar after investigar", async () => {
        const gameView = initializeView(factory => factory
            .ofSeeingEnemy(Action.INVESTIGAR, Card.INQUISIDOR, 0, false, false)
        );

        await gameView.contestByToaster(0);

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar");
    });

    it("should render correctly when using contestar after trocar", async () => {
        const gameView = initializeView(factory => factory
            .ofSeeingEnemy(Action.TROCAR, Card.EMBAIXADOR, undefined, false, false)
        );

        await gameView.contestByToaster(0);

        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar", 0);
    });
});

describe("Game View interactivity in post game update when being attacked", () => {
    function initializeView(
        configFactory: (factory: GameStateBuilder) => GameStateBuilder = factory => factory
    ) {
        const gameState = configFactory(new GameStateBuilder()).create();

        const gameView = new GameViewPO(gameState);

        return gameView;
    }

    it("should render correctly when using bloquear after extorquir when one card can block it", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "embaixador", "bloquearExtorquir"], false)
            .newConfig(["tiposCartas", "inquisidor", "bloquearExtorquir"], false)
            .ofBeingAttacked(Action.EXTORQUIR, Card.CAPITAO, undefined, undefined)
        );

        await gameView.block();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();
        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "capitao", 0);
    });

    it("should render correctly when using bloquear after extorquir when more than one card can block it", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.EXTORQUIR, Card.CAPITAO, undefined, undefined)
        );

        await gameView.block();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();
        expect(gameView.cardChooserMenu()).toBeInTheDocument();

        await gameView.selectEmbaixadorChoosableCard();

        expect(gameView.cardChooserMenu()).not.toBeInTheDocument();
        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "embaixador", 0);
    });

    it("should render correctly when using bloquear after assassinar", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.ASSASSINAR, Card.ASSASSINO, 0, undefined)
        );

        await gameView.block();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "condessa");
    });

    it("should render correctly when using bloquear after investigar", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearInvestigar"], true)
            .ofBeingAttacked(Action.INVESTIGAR, Card.INQUISIDOR, 0, undefined)
        );

        await gameView.block();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("bloquear", "duque");
    });

    it("should render correctly when using contestar after extorquir", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.EXTORQUIR, Card.CAPITAO, undefined, undefined)
        );

        await gameView.contest();

        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.cardPickingMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar", 0);
    });

    it("should render correctly when using contestar after assasinar", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.ASSASSINAR, Card.ASSASSINO, 0, undefined)
        );

        await gameView.contest();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar");
    });

    it("should render correctly when using contestar after investigar", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.INVESTIGAR, Card.INQUISIDOR, 0, undefined)
        );

        await gameView.contest();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar");
    });

    it("should render correctly when using contestar after blocking a ajuda externa", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.AJUDA_EXTERNA)
        );

        await gameView.contest();

        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar", 0);
    });

    it("should render correctly when using contestar after blocking a taxar", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTaxar"], true)
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.TAXAR)
        );

        await gameView.contest();

        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar", 0);
    });

    it("should render correctly when using contestar after blocking a extorquir", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.BLOQUEAR, Card.CAPITAO, undefined, Action.EXTORQUIR)
        );

        await gameView.contest();

        expect(gameView.cardPickingMenu()).toBeInTheDocument();

        await gameView.selectFirstPickableCard();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar", 0);
    });

    it("should render correctly when using contestar after blocking a assassinar", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.BLOQUEAR, Card.CONDESSA, undefined, Action.ASSASSINAR)
        );

        await gameView.contest();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar");
    });

    it("should render correctly when using contestar after blocking a investigar", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearInvestigar"], true)
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.INVESTIGAR)
        );

        await gameView.contest();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar");
    });

    it("should render correctly when using contestar after blocking a trocar", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTrocar"], true)
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.TROCAR)
        );

        await gameView.contest();

        expect(gameView.actionMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("contestar");
    });

    it("should render correctly when using continuar after extorquir", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.EXTORQUIR, Card.CAPITAO, undefined, undefined)
        );

        await gameView.accept();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("continuar");
    });

    it("should render correctly when using continuar after assassinar", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.ASSASSINAR, Card.ASSASSINO, 0, undefined)
        );

        await gameView.accept();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("continuar");
    });

    it("should render correctly when using continuar after investigar", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.INVESTIGAR, Card.INQUISIDOR, 0, undefined)
        );

        await gameView.accept();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("continuar");
    });

    it("should render correctly when using continuar after blocking a ajuda externa", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.AJUDA_EXTERNA)
        );

        await gameView.accept();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("continuar");
    });

    it("should render correctly when using continuar after blocking a taxar", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTaxar"], true)
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.TAXAR)
        );

        await gameView.accept();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("continuar");
    });

    it("should render correctly when using continuar after blocking a extorquir", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.BLOQUEAR, Card.CAPITAO, undefined, Action.EXTORQUIR)
        );

        await gameView.accept();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("continuar");
    });

    it("should render correctly when using continuar after blocking a assassinar", async () => {
        const gameView = initializeView(factory => factory
            .ofBeingAttacked(Action.BLOQUEAR, Card.CONDESSA, undefined, Action.ASSASSINAR)
        );

        await gameView.accept();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("continuar");
    });

    it("should render correctly when using continuar after blocking a investigar", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearInvestigar"], true)
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.INVESTIGAR)
        );

        await gameView.accept();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("continuar");
    });

    it("should render correctly when using continuar after blocking a trocar", async () => {
        const gameView = initializeView(factory => factory
            .newConfig(["tiposCartas", "duque", "bloquearTrocar"], true)
            .ofBeingAttacked(Action.BLOQUEAR, Card.DUQUE, undefined, Action.TROCAR)
        );

        await gameView.accept();

        expect(gameView.defenseMenu()).not.toBeInTheDocument();

        expect(socketEmitMock).toHaveBeenCalledWith("continuar");
    });
});