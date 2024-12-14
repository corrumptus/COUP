import { ContextType, GameState } from "@services/GameMessageService";
import type Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import type Game from "@entitys/Game";
import type Player from "@entitys/player";
import type { CardSlot } from "@entitys/player";

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

type PosInvestigar = Action.TROCAR | Action.CONTINUAR | Action.CONTESTAR;

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

export default class GameStateBuilder {
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
                isInvestigating: false,
                winContesting: true
            }
        }
    }

    create(): GameState {
        return this.gameState;
    }

    ofSeeingSelf<A extends Action, C extends A extends NonCard ? undefined : CardType>(
        action: A,
        card: C,
        hasTarget: A extends AttackerActions ? true : A extends Action.TROCAR ? boolean : false,
        targetCard: A extends WithTargetCard ? CardSlot
            : C extends CardType.INQUISIDOR ? CardSlot
                : undefined,
        isInvestigating: A extends PosInvestigar ? boolean : false,
        winContesting: A extends Action.CONTESTAR ? boolean : false
    ): this {
        this.gameState.context = {
            type: ContextType.OBSERVING,
            attacker: this.gameState.player.name,
            action: action,
            card: card,
            target: hasTarget ? this.gameState.game.players[0].name : undefined,
            attackedCard: targetCard,
            isInvestigating: isInvestigating,
            winContesting: winContesting
        };

        return this;
    }

    ofSeeingEnemy<A extends Action, C extends A extends NonCard ? undefined : CardType>(
        action: A,
        card: C,
        hasTarget: A extends AttackerActions ? true : A extends Action.TROCAR ? boolean : false,
        targetCard: A extends WithTargetCard ? CardSlot
            : C extends CardType.INQUISIDOR ? CardSlot
                : undefined,
        isInvestigating: A extends PosInvestigar ? boolean : false,
        winContesting: A extends Action.CONTESTAR ? boolean : false
    ): this {
        this.gameState.context = {
            type: ContextType.OBSERVING,
            attacker: this.gameState.game.players[0].name,
            action: action,
            card: card,
            target: hasTarget ? this.gameState.player.name : undefined,
            attackedCard: targetCard,
            isInvestigating: isInvestigating,
            winContesting: winContesting
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