import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Player from "../entity/player";
import Turn from "../entity/Turn";
import { ActionInfos } from "../service/GameMessageService";
import Config from "./Config";

export default class ActionSaver {
    static save(
        action: Action,
        turn: Turn,
        player: Player,
        cardType: CardType,
        selfCard: number,
        configs: Config
    ): ActionInfos {
        const actionMapper: {
            [key in Action]: () => void;
        } = {
            [Action.RENDA]: () => ActionSaver.saveRenda(turn, player, configs),
            [Action.AJUDA_EXTERNA]: () => ActionSaver.saveAjudaExterna(turn, player, configs),
            [Action.TAXAR]: () => ActionSaver.saveTaxar(turn, player, cardType, selfCard, configs)
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
}