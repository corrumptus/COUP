import Action from "../../src/entity/Action";
import CardType from "../../src/entity/CardType";
import { GameState, ContextType } from "../../src/service/GameMessageService";
import Player, { CardSlot } from "../../src/entity/player";
import Game from "../../src/entity/Game";

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
    Action.BLOQUEAR |
    Action.CONTESTAR;

type BloquearPreAction = Action.AJUDA_EXTERNA |
    Action.TAXAR |
    Action.EXTORQUIR |
    Action.ASSASSINAR |
    Action.INVESTIGAR |
    Action.TROCAR;

export default class GameStateFactory {
    private gameState: GameState;

    constructor(game: Game, ofPlayer: Player) {
        const gameState = game.getState();

        this.gameState = {
            player: ofPlayer.getState(),
            game: {
                ...gameState,
                players: gameState.players
                    .filter(p => p.name !== ofPlayer.name)
            },
            context: {
                type: ContextType.OBSERVING,
                attacker: gameState.currentPlayer,
                isInvestigating: false
            }
        }
    }

    create(): GameState {
        return this.gameState;
    }

    ofSeeingSelf<A extends Action, C extends CardType | undefined>(
        action: A,
        card: A extends NonCard ? undefined : C,
        hasTarget: A extends AttackerActions ? true : false,
        targetCard: A extends WithTargetCard ? CardSlot
            : C extends CardType.INQUISIDOR ? CardSlot
                : undefined,
        isInvestigating: A extends PosInvestigar ? boolean : false
    ): this {
        this.gameState.context = {
            type: ContextType.OBSERVING,
            attacker: this.gameState.player.name,
            action: action,
            card: card,
            target: hasTarget ? this.gameState.game.players[0].name : undefined,
            attackedCard: targetCard,
            isInvestigating: isInvestigating
        };

        return this;
    }

    ofSeeingEnemy<A extends Action, C extends CardType | undefined>(
        action: A,
        card: A extends NonCard ? undefined : C,
        hasTarget: A extends AttackerActions ? true : false,
        targetCard: A extends WithTargetCard ? CardSlot
            : C extends CardType.INQUISIDOR ? CardSlot
                : undefined,
        isInvestigating: A extends PosInvestigar ? boolean : false
    ): this {
        this.gameState.context = {
            type: ContextType.OBSERVING,
            attacker: this.gameState.game.players[0].name,
            action: action,
            card: card,
            target: hasTarget ? this.gameState.player.name : undefined,
            attackedCard: targetCard,
            isInvestigating: isInvestigating
        };

        return this;
    }

    ofBeingAttacked<A extends AttackerActions>(
        action: A,
        card: CardType,
        targetCard: A extends WithTargetCard ? CardSlot : undefined,
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
        card: CardType,
        selfCard: CardSlot,
        targetCardType: CardType,
        targetCard: CardSlot
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