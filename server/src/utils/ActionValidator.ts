import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Player from "../entity/player";

export default class ActionValidator {
    static validate(
        game: Game,
        player: Player,
        action: Action,
        card: CardType | undefined,
        selfCard: number | undefined,
        targetName: string | undefined,
        targetCard: number | undefined
    ) {
        const configs = game.getConfigs();

        if (
            player.getMoney() >= configs.quantidadeMaximaGolpeEstado &&
            action !== Action.GOLPE_ESTADO
        )
            throw new Error("O player precisa dar um golpe de estado neste turno.");

        const actionMapper: {
            [key in Action]: (...args: any[]) => void
        } = {};

        actionMapper[action]();
    }
}