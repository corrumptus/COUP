import { faker } from "@faker-js/faker";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";
import { Action, Card, ContextType, GameState } from "@type/game";
import { randomCardType, randomReligion } from "@tests/utils";

type NonCard = Action.RENDA |
    Action.AJUDA_EXTERNA |
    Action.GOLPE_ESTADO |
    Action.TROCAR_PROPRIA_RELIGIAO |
    Action.TROCAR_RELIGIAO_OUTRO |
    Action.CONTINUAR |
    Action.CONTESTAR;

type WithTargetCard = Action.ASSASSINAR |
    Action.INVESTIGAR |
    Action.GOLPE_ESTADO;

type PosInvestigar = Action.TROCAR | Action.CONTINUAR;

type AttackerActions = Action.EXTORQUIR |
    Action.ASSASSINAR |
    Action.INVESTIGAR |
    Action.BLOQUEAR;

type BloquearPreAction = Action.AJUDA_EXTERNA |
    Action.TAXAR |
    Action.EXTORQUIR |
    Action.ASSASSINAR |
    Action.INVESTIGAR |
    Action.TROCAR;

export default class GameStateBuilder {
    private gameState: GameState;
    private isPlayerTurn: boolean;
    private playerName: string;
    private otherPlayerName: string;

    constructor() {
        this.playerName = faker.person.fullName();
        this.otherPlayerName = faker.person.fullName();

        this.isPlayerTurn = true;

        this.gameState = {
            player: {
                name: this.playerName,
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
                religion: undefined
            },
            game: {
                asylum: 0,
                configs: JSON.parse(JSON.stringify(COUPDefaultConfigs)),
                players: [
                    {
                        name: this.otherPlayerName,
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
                        religion: undefined
                    }
                ],
                currentPlayer: this.playerName,
            },
            context: {
                type: ContextType.OBSERVING,
                attacker: this.playerName,
                isInvestigating: false
            }
        }
    }

    create(): GameState {
        return this.gameState;
    }

    asylumCoins(coins: number): this {
        if (this.gameState.game.configs.religiao.reforma)
            this.gameState.game.asylum = coins;

        return this;
    }

    toOtherPlayerTurn(): this {
        this.gameState.game.currentPlayer = this.isPlayerTurn ?
            this.otherPlayerName
            :
            this.playerName;

        this.isPlayerTurn != this.isPlayerTurn;

        return this;
    }

    newConfig(keys: string[], newValue: any | ((oldValue: any) => any)): this {
        let config: any = this.gameState.game.configs;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in config))
                throw new Error(`No key \`${keys[i]}\` in the object ${JSON.stringify(config)}`);

            config = config[keys[i]];
        }

        const last = keys.length - 1;

        config[keys[last]] = typeof newValue === "function" ?
            newValue(config[keys[last]])
            :
            newValue;

        if (
            keys[0] === "religiao" &&
            keys[1] === "reforma" &&
            (
                typeof newValue === "function" ?
                    newValue(config[keys[last]])
                    :
                    newValue
            ) === true
        )
            this.addReligion();

        if (keys[0] === "moedasIniciais")
            this.changeInitialMoney(
                typeof newValue === "function" ?
                    newValue(config[keys[last]])
                    :
                    newValue
            );

        return this;
    }

    private addReligion() {
        this.gameState.player.religion = randomReligion();

        this.gameState.game.players.forEach(p => {
            p.religion = randomReligion();
        });
    }

    private changeInitialMoney(newValue: number) {
        this.gameState.player.money = newValue;
        this.gameState.game.players[0].money = newValue;
    }

    ofSeeingEnemy<A extends Action, C extends Card | undefined>(
        action: A,
        card: A extends NonCard ? undefined : C,
        targetCard: A extends WithTargetCard ? number
            : C extends Card.INQUISIDOR ? number
                : undefined,
        isInvestigating: A extends PosInvestigar ? boolean : false
    ): this {
        this.gameState.context = {
            type: ContextType.OBSERVING,
            attacker: this.gameState.game.players[0].name,
            action: action,
            card: card,
            target: this.gameState.player.name,
            attackedCard: targetCard,
            isInvestigating: isInvestigating
        };

        return this;
    }

    ofBeingAttacked<A extends AttackerActions>(
        action: A,
        card: Card,
        targetCard: A extends WithTargetCard ? number : undefined,
        previousAction: A extends Action.BLOQUEAR ? BloquearPreAction : undefined
    ): this {
        this.gameState.context = {
            type: ContextType.BEING_ATTACKED,
            attacker: this.gameState.game.players[0].name,
            action: action,
            card: card,
            attackedCard: targetCard,
            previousAction: previousAction
        };

        return this;
    }

    ofInvestigating(
        card: Card,
        selfCard: number,
        targetCardType: Card,
        targetCard: number
    ): this {
        this.gameState.context = {
            type: ContextType.INVESTIGATING,
            card: card,
            selfCard: selfCard,
            target: this.gameState.game.players[0].name,
            investigatedCard: targetCardType,
            targetCard: targetCard
        };

        return this;
    }
}