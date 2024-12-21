import Action from "@entitys/Action";
import CardType from "@entitys/CardType";
import Game from "@entitys/Game";
import Player, { CardSlot } from "@entitys/player";
import Turn from "@entitys/Turn";
import { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { TurnState } from "./ActionHandler";
import ActionHandlerFactory from "./ActionHandlerFactory";

type HandleResult = {
    actionInfos: ActionInfos,
    turnState: TurnState
}

export default class ActionHandlerFacade {
    private game: Game;
    private turn: Turn;
    private action: Action;
    private player: Player;
    private cardType: CardType | undefined;
    private card: number | undefined;
    private target: Player | undefined;
    private targetCard: number | undefined;

    constructor(
        game: Game,
        turn: Turn,
        action: Action,
        player: Player,
        cardType: CardType | undefined,
        card: number | undefined,
        target: Player | undefined,
        targetCard: number | undefined
    ) {
        this.game = game;
        this.turn = turn;
        this.action = action;
        this.player = player;
        this.cardType = cardType;
        this.card = card;
        this.target = target;
        this.targetCard = targetCard;
    }

    handle(): HandleResult {
        const actionHandler: ActionHandler = ActionHandlerFactory.create(this.action);

        actionHandler.validate({
            turn: this.turn,
            configs: this.game.getConfigs(),
            asylumCoins: this.game.getAsylumCoins(),
            player: this.player,
            card: this.cardType,
            selfCard: this.card,
            target: this.target,
            targetCard: this.targetCard
        });

        actionHandler.save({
            turn: this.turn,
            configs: this.game.getConfigs(),
            asylumAPI: {
                get: () => this.game.getAsylumCoins(),
                reset: () => this.game.resetAsylumCoins(),
                add: (amount: number) => this.game.addAsylumCoins(amount)
            },
            player: this.player,
            card: this.cardType,
            selfCard: this.card as CardSlot | undefined,
            target: this.target,
            targetCard: this.targetCard as CardSlot | undefined
        });

        const turnState = actionHandler.finish();

        const actionInfos = actionHandler.actionInfos({
            turn: this.turn,
            configs: this.game.getConfigs(),
            asylumAPI: {
                get: this.game.getAsylumCoins,
                reset: this.game.resetAsylumCoins,
                add: this.game.addAsylumCoins
            },
            player: this.player,
            card: this.cardType,
            selfCard: this.card as CardSlot | undefined,
            target: this.target,
            targetCard: this.targetCard as CardSlot | undefined
        });

        return {
            actionInfos: actionInfos,
            turnState: turnState
        }
    }
}