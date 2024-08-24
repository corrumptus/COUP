import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Player, { isCardSlot } from "../entity/player";
import Turn from "../entity/Turn";
import Config from "./Config";

export default class ActionValidator {
    static validate(
        player: Player,
        action: Action,
        card: CardType | undefined,
        selfCard: number | undefined,
        target: Player | undefined,
        targetCard: number | undefined,
        turn: Turn,
        configs: Config,
        asylumCoins: number
    ) {
        if (!player.hasNonKilledCards)
            throw new Error("O player está morto");

        if (
            player.getMoney() >= configs.quantidadeMaximaGolpeEstado &&
            action !== Action.GOLPE_ESTADO
        )
            throw new Error("O player precisa dar um golpe de estado neste turno.");

        if (
            ActionValidator.isPlayerBeingAttacked(turn, player.name)
            &&
            !ActionValidator.isDefenseAction(action)
        )
            throw new Error("O player precisa se defender");

        const actionMapper = {
            [Action.RENDA]: () => ActionValidator.validateRenda(),
            [Action.AJUDA_EXTERNA]: () => ActionValidator.validateAjudaExterna(),
            [Action.TAXAR]: () => ActionValidator.validateTaxar(player, card, selfCard, configs),
            [Action.CORRUPCAO]: () => ActionValidator.validateCorrupcao(player, card, selfCard, configs, asylumCoins),
            [Action.EXTORQUIR]: () => ActionValidator.validateExtorquir(player, card, selfCard, target, configs),
            [Action.ASSASSINAR]: () => ActionValidator.validateAssassinar(player, card, selfCard, target, targetCard, configs),
            [Action.INVESTIGAR]: () => ActionValidator.validateInvestigar(player, card, selfCard, target, targetCard, configs),
            [Action.GOLPE_ESTADO]: () => ActionValidator.validateGolpeEstado(player, target, targetCard, configs),
            [Action.TROCAR]: () => ActionValidator.validateTrocar(player, card, selfCard, targetCard, configs),
            [Action.TROCAR_PROPRIA_RELIGIAO]: () => ActionValidator.validateTrocarPropriaReligiao(player, configs),
            [Action.TROCAR_RELIGIAO_OUTRO]: () => ActionValidator.validateTrocarReligiaoOutro(player, target, configs),
            [Action.BLOQUEAR]: () => ActionValidator.validateBloquear(player, card, selfCard, turn, configs),
            [Action.CONTESTAR]: () => ActionValidator.validateContestar(player, selfCard, turn),
            [Action.CONTINUAR]: () => ActionValidator.validateContinuar()
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

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (!configs.tiposCartas[card].taxar)
            throw new Error("O tipo de carta escolhida não pode taxar");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");
    }

    private static validateCorrupcao(
        player: Player,
        card: CardType | undefined,
        selfCard: number | undefined,
        configs: Config,
        asylumCoins: number
    ) {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (!configs.religiao.cartasParaCorrupcao[card])
            throw new Error("O tipo de carta escolhida não pode corromper");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (asylumCoins === 0)
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

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (!configs.tiposCartas[card].extorquir)
            throw new Error("O tipo de carta escolhida não pode extorquir");

        if (player.getCard(selfCard).getIsKilled())
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
        configs: Config
    ) {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (targetCard === undefined)
            throw new Error("Uma das cartas do inimigo deve ser escolhida");

        if (!isCardSlot(targetCard))
            throw new Error("O index da carta do inimigo deve ser 0 ou 1");

        if (!configs.tiposCartas[card].assassinar)
            throw new Error("O tipo de carta escolhida não pode assassinar");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (target.getCard(targetCard).getIsKilled())
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
        configs: Config
    ) {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (target === undefined)
            throw new Error("Um inimigo deve ser escolhido");

        if (targetCard === undefined)
            throw new Error("Uma das cartas do inimigo deve ser escolhida");

        if (!isCardSlot(targetCard))
            throw new Error("O index da carta do inimigo deve ser 0 ou 1");

        if (!configs.tiposCartas[card].investigar)
            throw new Error("O tipo de carta escolhida não pode investigar");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (target.getCard(targetCard).getIsKilled())
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

        if (!isCardSlot(targetCard))
            throw new Error("O index da carta do inimigo deve ser 0 ou 1");

        if (player.getMoney() < configs.quantidadeMinimaGolpeEstado)
            throw new Error("O player não tem dinheiro suficiente para dar um golpe de estado");

        if (target.getCard(targetCard).getIsKilled())
            throw new Error("A carta do inimigo escolhida já está morta");
    }

    private static validateTrocar(
        player: Player,
        card: CardType | undefined,
        selfCard: number | undefined,
        targetCard: number | undefined,
        configs: Config
    ) {
        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (!configs.tiposCartas[card].trocar)
            throw new Error("O tipo de carta escolhida não pode trocar");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (
            configs.tiposCartas[card].quantidadeTrocar === 1
            &&
            targetCard === undefined
        )
            throw new Error("Uma carta deve ser escolhida");

        if (
            configs.tiposCartas[card].quantidadeTrocar === 1
            &&
            targetCard !== undefined
            &&
            !isCardSlot(targetCard)
        )
            throw new Error("O index da carta escolhida deve ser 0 ou 1");

        if (
            configs.tiposCartas[card].quantidadeTrocar === 1
            &&
            targetCard !== undefined
            &&
            isCardSlot(targetCard)
            &&
            player.getCard(targetCard).getIsKilled()
        )
            throw new Error("A carta escolhida já está morta");
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

    private static validateBloquear(
        player: Player,
        card: CardType | undefined,
        selfCard: number | undefined,
        turn: Turn,
        configs: Config
    ) {
        if ([Action.ASSASSINAR, Action.INVESTIGAR].includes(turn.getLastAction() as Action))
            return;

        if (card === undefined)
            throw new Error("Um tipo de carta deve ser escolhido");

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");

        if (!ActionValidator.canBlockPreviousAction(turn, card, configs))
            throw new Error("O tipo de carta escolhida não pode bloquear está ação");
    }

    private static validateContestar(
        player: Player,
        selfCard: number | undefined,
        turn: Turn
    ) {
        if (turn.getLastAction() !== Action.BLOQUEAR)
            if (
                [Action.ASSASSINAR, Action.INVESTIGAR]
                    .includes(turn.getLastAction() as Action)
            )
                return;
        else
            if (turn.getFirstAction() !== Action.AJUDA_EXTERNA)
                return;

        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");
    }

    private static validateContinuar() {}

    private static isPlayerBeingAttacked(turn: Turn, name: string): boolean {
        return turn.getTarget()?.name === name;
    }

    private static isDefenseAction(action: Action): boolean {
        return [Action.CONTESTAR, Action.BLOQUEAR, Action.CONTINUAR].includes(action);
    }

    private static canBlockPreviousAction(turn: Turn, card: CardType, configs: Config): boolean {
        const blockMapper = {
            [Action.AJUDA_EXTERNA]: () => configs.tiposCartas[card].taxar,
            [Action.TAXAR]: () => configs.tiposCartas[card].bloquearTaxar,
            [Action.EXTORQUIR]: () => configs.tiposCartas[card].bloquearExtorquir,
            [Action.TROCAR]: () => configs.tiposCartas[card].bloquearTrocar
        }

        const previousAction = turn.getLastAction() as keyof typeof blockMapper;

        return blockMapper[previousAction]();
    }
}