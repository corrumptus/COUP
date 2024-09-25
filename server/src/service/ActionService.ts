import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import { CardSlot } from "../entity/player";
import Turn from "../entity/Turn";
import ActionSaver from "../utils/ActionSaver";
import ActionTurnFinisher from "../utils/ActionTurnFinisher";
import ActionValidator from "../utils/ActionValidator";
import Config from "../utils/Config";
import { ActionInfos } from "./GameMessageService";
import GameService from "./GameService";
import PlayerService from "./PlayerService";

export default class ActionService {
    static makeAction(
        socketId: string,
        action: Action,
        cardType?: CardType,
        selfCard?: number,
        targetName?: string,
        targetCard?: number
    ): ActionInfos {
        const { id: lobbyId } = PlayerService.getPlayersLobby(socketId);

        const game = GameService.getPlayersGame(socketId);

        if (game === undefined)
            throw new Error("Player is not playing a game");

        const turn = ActionService.getTheCorrectTurn(game);

        const player = turn.getPlayer();

        const target = targetName === undefined ?
            turn.getTarget()
            :
            PlayerService.getPlayerByName(targetName);

        ActionValidator.validateSocketTurn(PlayerService.getPlayer(socketId), turn);

        ActionValidator.validate(player, action, cardType, selfCard, target, targetCard, turn, game.getConfigs(), game.getAsylumCoins());

        ActionSaver.save(action, game, turn, player, cardType, selfCard as CardSlot | undefined, target, targetCard as CardSlot | undefined);

        ActionTurnFinisher.finish(action, lobbyId, game, turn);

        return ActionService.getActionInfos(turn, cardType, targetCard as CardSlot | undefined, game.getConfigs());
    }

    private static getTheCorrectTurn(game: Game): Turn {
        const lastTurn = game.getTurn(-1) as Turn;
        const preLastTurn = game.getTurn(-2);

        if (preLastTurn === undefined || preLastTurn.isfinished)
            return lastTurn;

        game.removeLastTurn();

        return preLastTurn;
    }

    private static getActionInfos(
        turn: Turn,
        cardType: CardType | undefined,
        attackedCard: CardSlot | undefined,
        configs: Config
    ): ActionInfos {
        let player = turn.getPlayer().name;
        let target = turn.getTarget()?.name;
        let isInvestigating = false;

        const actions = turn.getAllActions();

        let lastAction: Action | undefined = actions[actions.length - 1];

        if (lastAction === Action.CONTINUAR)
            lastAction = undefined;

        if (
            (
                actions.length === 2
                &&
                [Action.CONTESTAR, Action.BLOQUEAR].includes(lastAction as Action)
            )
            ||
            (
                actions.length === 3
                &&
                actions[1] === Action.BLOQUEAR
            )
        )
            [ player, target ] = [ target as string, player ];

        const lastCardType = turn.getLastCardType() as CardType;

        if (
            actions[0] === Action.INVESTIGAR
            &&
            (
                actions[1] === Action.CONTINUAR
                ||
                (
                    actions[1] === Action.BLOQUEAR
                    &&
                    actions[2] === Action.CONTESTAR
                    &&
                    !configs.tiposCartas[lastCardType].bloquearInvestigar
                )
                ||
                (
                    actions[1] === Action.CONTESTAR
                    &&
                    configs.tiposCartas[lastCardType].investigar
                )
            )
        )
            isInvestigating = true;

        return {
            attacker: player,
            action: lastAction,
            cardType: cardType,
            target: target,
            attackedCard: attackedCard,
            isInvestigating: isInvestigating
        };
    }
}