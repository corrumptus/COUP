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
        target: Player | undefined,
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
            [Action.CORRUPCAO]: () => ActionValidator.validateCorrupcao(player, card, selfCard, game),
            [Action.EXTORQUIR]: () => ActionValidator.validateExtorquir(player, card, selfCard, target, game.getConfigs()),
            [Action.ASSASSINAR]: () => ActionValidator.validateAssassinar(player, card, selfCard, target, targetCard, game),
            [Action.INVESTIGAR]: () => ActionValidator.validateInvestigar(player, card, selfCard, target, targetCard, game),
            [Action.GOLPE_ESTADO]: () => ActionValidator.validateGolpeEstado(player, target, targetCard, game.getConfigs()),
            [Action.TROCAR_PROPRIA_RELIGIAO]: () => ActionValidator.validateTrocarPropriaReligiao(player, game.getConfigs()),
            [Action.TROCAR_RELIGIAO_OUTRO]: () => ActionValidator.validateTrocarReligiaoOutro(player, target, game.getConfigs())
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
            throw new Error("A sua carta escolhida já está morta");
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
            throw new Error("A sua carta escolhida já está morta");

        if (game.getAsylumCoins() === 0)
            throw new Error("O asilo não possui moedas para serem pegas");
    }

    private static validateExtorquir(
        player: Player,
        card: CardType | undefined,
        selfCard: number | undefined,
        target: Player | undefined,
        configs: Config
    ) {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (!configs.tiposCartas[card].extorquir)
            throw new Error("O tipo de carta escolhida não pode extorquir");

        if (player.getCard(selfCard)?.getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (target.getMoney() < configs.tiposCartas[card].quantidadeExtorquir)
            throw new Error("O inimigo não tem dinheiro suficiente para ser extorquido");
    }

    private static validateAssassinar(
        player: Player,
        card: CardType | undefined,
        selfCard: number | undefined,
        target: Player | undefined,
        targetCard: number | undefined,
        game: Game
    ) {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (targetCard === undefined)
            throw new Error("Uma das cartas do inimigo deve ser escolhida");

        const configs = game.getConfigs();

        if (!configs.tiposCartas[card].assassinar)
            throw new Error("O tipo de carta escolhida não pode assassinar");

        if (player.getCard(selfCard)?.getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (target.getCard(targetCard)?.getIsKilled())
            throw new Error("A carta do inimigo escolhida já está morta");

        if (player.getMoney() < configs.tiposCartas[card].quantidadeAssassinar)
            throw new Error("O player não tem dinheiro suficiente para assassinar");
    }

    private static validateInvestigar(
        player: Player,
        card: CardType | undefined,
        selfCard: number | undefined,
        target: Player | undefined,
        targetCard: number | undefined,
        game: Game
    ) {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (targetCard === undefined)
            throw new Error("Uma das cartas do inimigo deve ser escolhida");

        const configs = game.getConfigs();

        if (!configs.tiposCartas[card].investigar)
            throw new Error("O tipo de carta escolhida não pode investigar");

        if (player.getCard(selfCard)?.getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (target.getCard(targetCard)?.getIsKilled())
            throw new Error("A carta do inimigo escolhida já está morta");
    }

    private static validateGolpeEstado(
        player: Player,
        target: Player | undefined,
        targetCard: number | undefined,
        configs: Config
    ) {
        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (targetCard === undefined)
            throw new Error("Uma das cartas do inimigo deve ser escolhida");

        if (player.getMoney() < configs.quantidadeMinimaGolpeEstado)
            throw new Error("O player não tem dinheiro suficiente para dar um golpe de estado");

        if (target.getCard(targetCard)?.getIsKilled())
            throw new Error("A carta do inimigo escolhida já está morta");
    }

    private static validateTrocarPropriaReligiao(player: Player, configs: Config) {
        if (!configs.religiao.reforma)
            throw new Error("O jogo não passou pela reforma e não possui religião");

        if (player.getMoney() < configs.religiao.quantidadeTrocarPropria)
            throw new Error("O player não tem dinheiro suficiente para trocar sua própria religião");
    }

    private static validateTrocarReligiaoOutro(
        player: Player,
        target: Player | undefined,
        configs: Config
    ) {
        if (!configs.religiao.reforma)
            throw new Error("O jogo não passou pela reforma e não possui religião");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (!target.hasNonKilledCards)
            throw new Error("O inimigo já está morto");

        if (player.getMoney() < configs.religiao.quantidadeTrocarOutro)
            throw new Error("O player não tem dinheiro suficiente para trocar a religião do inimigo");
    }

    private static isPlayerBeingAttacked(game: Game, name: string): boolean {
        return game.getLastTurn()?.getTarget()?.name === name;
    }

    private static isDefenseAction(action: Action): boolean {
        return [Action.CONTESTAR, Action.BLOQUEAR, Action.CONTINUAR].includes(action);
    }
}