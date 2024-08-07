import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Player from "../entity/player";
import Config from "./Config";

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

        if (!game.hasPlayer(player))
            throw new Error("O player não está no jogo");

        if (!player.hasNonKilledCards)
            throw new Error("O player está morto");

        if (
            player.getMoney() >= configs.quantidadeMaximaGolpeEstado &&
            action !== Action.GOLPE_ESTADO
        )
            throw new Error("O player precisa dar um golpe de estado neste turno.");

        if (
            ActionValidator.isPlayerBeingAttacked(game, player.name)
            &&
            !ActionValidator.isDefenseAction(action)
        )
            throw new Error("O player precisa se defender");

        const actionMapper: {
            [key in Action]: (...args: any[]) => void
        } = {
            [Action.RENDA]: () => ActionValidator.validateRenda(),
            [Action.AJUDA_EXTERNA]: () => ActionValidator.validateAjudaExterna(),
            [Action.TAXAR]: () => ActionValidator.validateTaxar(player, card, selfCard, game.getConfigs()),
            [Action.CORRUPCAO]: () => ActionValidator.validateCorrupcao(player, card, selfCard, game)
        };

        actionMapper[action]();
    }

    private static validateRenda() {}

    private static validateAjudaExterna() {}

    private static validateTaxar(
        player: Player,
        card: CardType | undefined,
        selfCard: number | undefined,
        configs: Config
    ) {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!configs.tiposCartas[card].taxar)
            throw new Error("O tipo de carta escolhida não pode taxar");

        if (player.getCard(selfCard)?.getIsKilled())
            throw new Error("A carta escolhida já está morta");
    }

    private static validateCorrupcao(
        player: Player,
        card: CardType | undefined,
        selfCard: number | undefined,
        game: Game
    ) {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        const configs = game.getConfigs();

        if (!configs.religiao.cartasParaCorrupcao[card])
            throw new Error("O tipo de carta escolhida não pode corromper");

        if (player.getCard(selfCard)?.getIsKilled())
            throw new Error("A carta escolhida já está morta");

        if (game.getAsylumCoins() === 0)
            throw new Error("O asilo não possui moedas para serem pegas");
    }

    private static isPlayerBeingAttacked(game: Game, name: string): boolean {
        return game.getLastTurn()?.getTarget()?.name === name;
    }

    private static isDefenseAction(action: Action): boolean {
        return [Action.CONTESTAR, Action.BLOQUEAR, Action.CONTINUAR].includes(action);
    }
}