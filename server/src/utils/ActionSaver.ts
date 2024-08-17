import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Player from "../entity/player";
import Turn from "../entity/Turn";
import { ActionInfos } from "../service/GameMessageService";
import Config from "./Config";

export default class ActionSaver {
    static save(
        action: Action,
        game: Game,
        turn: Turn,
        player: Player,
        cardType?: CardType,
        selfCard?: number,
        target?: Player,
        targetCard?: number
    ): ActionInfos {
        const actionMapper: {
            [key in Action]: () => void;
        } = {
            [Action.RENDA]: () => ActionSaver.saveRenda(turn, player, game.getConfigs()),
            [Action.AJUDA_EXTERNA]: () => ActionSaver.saveAjudaExterna(turn, player, game.getConfigs()),
            [Action.TAXAR]: () => ActionSaver.saveTaxar(turn, player, cardType as CardType, selfCard as number, game.getConfigs()),
            [Action.CORRUPCAO]: () => ActionSaver.saveCorrupcao(game, turn, player, cardType as CardType, selfCard as number),
            [Action.EXTORQUIR]: () => ActionSaver.saveExtorquir(turn, cardType as CardType, selfCard as number, target as Player),
            [Action.ASSASSINAR]: () => ActionSaver.saveAssassinar(turn, player, cardType as CardType, selfCard as number, target as Player, targetCard as number, game.getConfigs()),
            [Action.INVESTIGAR]: () => ActionSaver.saveInvestigar(turn, cardType as CardType, selfCard as number, target as Player, targetCard as number),
            [Action.GOLPE_ESTADO]: () => ActionSaver.saveGolpeEstado(turn, player, target as Player, targetCard as number, game.getConfigs()),
            [Action.TROCAR]: () => ActionSaver.saveTrocar(turn, player, cardType as CardType, selfCard as number, target as Player, targetCard as number, game.getConfigs())
        }

        actionMapper[action]();
    }

    private static saveRenda(turn: Turn, player: Player, configs: Config) {
        player.addMoney(configs.renda);

        turn.addAction(Action.RENDA);
    }

    private static saveAjudaExterna(turn: Turn, player: Player, configs: Config) {
        player.addMoney(configs.ajudaExterna);

        turn.addAction(Action.AJUDA_EXTERNA);
    }

    private static saveTaxar(
        turn: Turn,
        player: Player,
        cardType: CardType,
        selfCard: number,
        configs: Config
    ) {
        player.addMoney(configs.tiposCartas[cardType].quantidadeTaxar);

        turn.addAction(Action.TAXAR);
        turn.addCardType(cardType);
        turn.addCard(selfCard);
    }

    private static saveCorrupcao(
        game: Game,
        turn: Turn,
        player: Player,
        cardType: CardType,
        selfCard: number
    ) {
        player.addMoney(game.getAsylumCoins());

        game.resetAsylumCoins();

        turn.addAction(Action.CORRUPCAO);
        turn.addCardType(cardType);
        turn.addCard(selfCard);
    }

    private static saveExtorquir(
        turn: Turn,
        cardType: CardType,
        selfCard: number,
        target: Player
    ) {
        turn.addAction(Action.EXTORQUIR);
        turn.addTarget(target);
        turn.addCardType(cardType);
        turn.addCard(selfCard);
    }

    private static saveAssassinar(
        turn: Turn,
        player: Player,
        cardType: CardType,
        selfCard: number,
        target: Player,
        targetCard: number,
        configs: Config
    ) {
        player.removeMoney(configs.tiposCartas[cardType].quantidadeAssassinar);

        turn.addAction(Action.ASSASSINAR);
        turn.addTarget(target);
        turn.addCardType(cardType);
        turn.addCard(selfCard);
        turn.addCard(targetCard);
    }

    private static saveInvestigar(
        turn: Turn,
        cardType: CardType,
        selfCard: number,
        target: Player,
        targetCard: number,
    ) {
        turn.addAction(Action.ASSASSINAR);
        turn.addTarget(target);
        turn.addCardType(cardType);
        turn.addCard(selfCard);
        turn.addCard(targetCard);
    }

    private static saveGolpeEstado(
        turn: Turn,
        player: Player,
        target: Player,
        targetCard: number,
        configs: Config
    ) {
        player.removeMoney(configs.quantidadeMinimaGolpeEstado);

        target.killCard(targetCard);

        turn.addAction(Action.GOLPE_ESTADO);
        turn.addTarget(target);
        turn.addCard(targetCard);
    }

    private static saveTrocar(
        turn: Turn,
        player: Player,
        cardType: CardType,
        selfCard: number,
        target: Player,
        targetCard: number,
        configs: Config
    ) {
        turn.addAction(Action.TROCAR);

        if (turn.getFirstAction() !== Action.TROCAR) {
            target.changeCard(targetCard);
            return;
        }

        turn.addCard(selfCard);

        if (configs.tiposCartas[cardType].quantidadeTrocar === 2) {
            player.changeCards();
            return;
        }

        player.changeCard(targetCard);
        turn.addCard(targetCard);
    }
}