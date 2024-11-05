import { ContextType, GameState, PlayerState } from "@type/game";
import GameViewPO from "./GameViewPO";
import { faker } from "@faker-js/faker";
import { randomCardType } from "./utils";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";

jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useRouter: jest.fn()
}));

describe("testing Game view game init render", () => {
    const playerName = faker.person.fullName();
    const gameInitState: GameState = {
        player: {
            name: playerName,
            cards: [
                {
                    card: randomCardType(),
                    isDead: false
                },
                {
                    card: randomCardType(),
                    isDead: false
                }
            ],
            money: COUPDefaultConfigs.moedasIniciais,
            state: PlayerState.WAITING_TURN
        },
        game: {
            asylum: 0,
            configs: COUPDefaultConfigs,
            players: [
                {
                    name: faker.person.fullName(),
                    cards: [
                        {
                            card: undefined,
                            isDead: false
                        },
                        {
                            card: undefined,
                            isDead: false
                        }
                    ],
                    money: COUPDefaultConfigs.moedasIniciais,
                }
            ],
            currentPlayer: playerName,
        },
        context: {
            type: ContextType.OBSERVING,
            attacker: playerName,
            isInvestigating: false
        }
    }

    it("should render correctly in the game beginning when player is the first player and default configurations in pc view", async () => {
        const gameView = new GameViewPO(gameInitState);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).not.toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(playerName);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is not the first player and default configurations in pc view", async () => {
        const newGameState: GameState = JSON.parse(JSON.stringify(gameInitState));

        newGameState.game.currentPlayer = newGameState.game.players[0].name;

        const gameView = new GameViewPO(newGameState);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).not.toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(newGameState.game.players[0].name);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is the first player and no default configurations in pc view", async () => {
        const newGameState: GameState = JSON.parse(JSON.stringify(gameInitState));

        newGameState.game.configs.moedasIniciais++;
        newGameState.game.configs.renda++;
        newGameState.game.configs.ajudaExterna--;

        const expectedConfigDiffs = [
            "Moedas iniciais: 3 -> 4",
            "Renda: 1 -> 2",
            "Ajuda externa: 2 -> 1"
        ];

        const gameView = new GameViewPO(newGameState);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).not.toBeInTheDocument();
        expect(gameView.nextPerson()).not.toBeInTheDocument();
        expect(gameView.configDiffs()).toBeInTheDocument();

        gameView.allConfigDiffTextContent().forEach((text, i) => {
            expect(text).toHaveTextContent(expectedConfigDiffs[i]);
        });
    });

    it("should render correctly in the game beginning when player is the first player and default configurations in mobile view", async () => {
        const gameView = new GameViewPO(gameInitState, 500);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(playerName);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is not the first player and default configurations in mobile view", async () => {
        const newGameState: GameState = JSON.parse(JSON.stringify(gameInitState));

        newGameState.game.currentPlayer = newGameState.game.players[0].name;

        const gameView = new GameViewPO(newGameState, 500);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).toBeInTheDocument();
        expect(gameView.nextPerson()).toBeInTheDocument();
        expect(gameView.nextPerson()).toHaveTextContent(newGameState.game.players[0].name);
        expect(gameView.configDiffs()).not.toBeInTheDocument();
    });

    it("should render correctly in the game beginning when player is the first player and no default configurations in mobile view", async () => {
        const newGameState: GameState = JSON.parse(JSON.stringify(gameInitState));

        newGameState.game.configs.moedasIniciais++;
        newGameState.game.configs.renda++;
        newGameState.game.configs.ajudaExterna--;

        const expectedConfigDiffs = [
            "Moedas iniciais: 3 -> 4",
            "Renda: 1 -> 2",
            "Ajuda externa: 2 -> 1"
        ];

        const gameView = new GameViewPO(newGameState, 500);

        expect(gameView.html()).toBeInTheDocument();
        expect(gameView.mobileMenuIcon()).toBeInTheDocument();
        expect(gameView.nextPerson()).not.toBeInTheDocument();
        expect(gameView.configDiffs()).toBeInTheDocument();

        gameView.allConfigDiffTextContent().forEach((text, i) => {
            expect(text).toHaveTextContent(expectedConfigDiffs[i]);
        });
    });
});