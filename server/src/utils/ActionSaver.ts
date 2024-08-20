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
            [Action.TROCAR]: () => ActionSaver.saveTrocar(turn, player, cardType as CardType, selfCard as number, target as Player, targetCard as number, game.getConfigs()),
            [Action.TROCAR_PROPRIA_RELIGIAO]: () => ActionSaver.saveTrocarPropriaReligiao(turn, player, game.getConfigs()),
            [Action.TROCAR_RELIGIAO_OUTRO]: () => ActionSaver.saveTrocarReligiaoOutro(turn, player, target as Player, game.getConfigs()),
            [Action.BLOQUEAR]: () => ActionSaver.saveBloquear(turn, cardType as CardType, selfCard as number, target as Player),
            [Action.CONTESTAR]: () => ActionSaver.saveContestar(turn, player, selfCard as number, target as Player, game.getConfigs()),
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

    private static saveTrocarPropriaReligiao(turn: Turn, player: Player, configs: Config) {
        player.removeMoney(configs.religiao.quantidadeTrocarPropria);
        player.changeReligion();

        turn.addAction(Action.TROCAR_PROPRIA_RELIGIAO);
    }

    private static saveTrocarReligiaoOutro(turn: Turn, player: Player, target: Player, configs: Config) {
        player.removeMoney(configs.religiao.quantidadeTrocarOutro);
        target.changeReligion();

        turn.addAction(Action.TROCAR_RELIGIAO_OUTRO);
        turn.addTarget(target);
    }

    private static saveBloquear(
        turn: Turn,
        cardType: CardType,
        selfCard: number,
        target: Player
    ) {
        turn.addAction(Action.BLOQUEAR);

        const lastAction = turn.getLastAction() as Action;

        const needAddSomethingActions = [
            Action.AJUDA_EXTERNA,
            Action.TAXAR,
            Action.EXTORQUIR,
            Action.TROCAR
        ];

        const needTargetActions = [
            Action.AJUDA_EXTERNA,
            Action.TAXAR,
            Action.TROCAR
        ];

        if (!needAddSomethingActions.includes(lastAction))
            return;

        if (needTargetActions.includes(lastAction))
            turn.addTarget(target);

        turn.addCardType(cardType);
        turn.addCard(selfCard);
    }

    private static saveContestar(
        turn: Turn,
        player: Player,
        selfCard: number,
        target: Player,
        configs: Config
    ) {
        const contestarMapper = {
            [Action.TAXAR]: () => {
                const taxarCard = turn.getFirstCard() as number;

                const taxarCardType = player.getCard(taxarCard).getType();

                if (configs.tiposCartas[taxarCardType].taxar)
                    target.killCard(selfCard);
                else {
                    player.killCard(taxarCard);
                    player.rollbackMoney();
                }

                turn.addCard(selfCard);
            },
            [Action.CORRUPCAO]: () => {
                const corrupcaoCard = turn.getFirstCard() as number;

                const corrupcaoCardType = player.getCard(corrupcaoCard).getType();

                if (configs.religiao.cartasParaCorrupcao[corrupcaoCardType])
                    target.killCard(selfCard);
                else {
                    player.killCard(corrupcaoCard);
                    player.rollbackMoney();
                }

                turn.addCard(selfCard);
            },
            [Action.EXTORQUIR]: () => {
                const extorquirCard = turn.getFirstCard() as number;

                const extorquirCardType = player.getCard(extorquirCard).getType();

                if (configs.tiposCartas[extorquirCardType].extorquir) {
                    const extorquirAmount = configs.tiposCartas[extorquirCardType].quantidadeExtorquir;

                    target.removeMoney(extorquirAmount);
                    player.addMoney(extorquirAmount);

                    target.killCard(selfCard);
                } else
                    player.killCard(extorquirCard);

                turn.addCard(selfCard);
            },
            [Action.ASSASSINAR]: () => {
                const assassinarCard = turn.getFirstCard() as number;

                const assassinarCardType = player.getCard(assassinarCard).getType();

                if (configs.tiposCartas[assassinarCardType].assassinar) {
                    const cardKilledByKiller = turn.getLastCard() as number;

                    const cardKilledByContestar = (cardKilledByKiller+1)%2;

                    target.killCard(cardKilledByKiller);
                    target.killCard(cardKilledByContestar);
                } else
                    player.killCard(assassinarCard);
            },
            [Action.INVESTIGAR]: () => {
                const investigarCard = turn.getFirstCard() as number;

                const investigarCardType = player.getCard(investigarCard).getType();

                if (configs.tiposCartas[investigarCardType].investigar) {
                    const investigatedCard = turn.getLastCard() as number;

                    const cardKilledByContestar = (investigatedCard+1)%2;

                    target.killCard(cardKilledByContestar);
                } else
                    player.killCard(investigarCard);
            },
            [Action.TROCAR]: () => {
                const trocarCard = turn.getFirstCard() as number;

                const trocarCardType = player.getCard(trocarCard).getType();

                if (configs.tiposCartas[trocarCardType].trocar)
                    target.killCard(selfCard);
                else {
                    player.rollbackCards();
                    player.killCard(trocarCard);
                }

                turn.addCard(selfCard);
            },
            [Action.BLOQUEAR]: () => {
                const bloquearMapper = {
                    [Action.AJUDA_EXTERNA]: () => {
                        const bloquearCard = turn.getFirstCard() as number;

                        const bloquearCardType = target.getCard(bloquearCard).getType();

                        if (configs.tiposCartas[bloquearCardType].taxar) {
                            player.rollbackMoney();
                            player.killCard(selfCard);
                        } else
                            target.killCard(bloquearCard);

                        turn.addCard(selfCard);
                    },
                    [Action.TAXAR]: () => {
                        const taxarCard = turn.getFirstCard() as number;

                        const bloquearCard = turn.getLastCard();

                        const bloquearCardType = target.getCard(bloquearCard).getType();

                        if (configs.tiposCartas[bloquearCardType].bloquearTaxar) {
                            player.rollbackMoney();
                            player.killCard(taxarCard);
                        } else
                            target.killCard(bloquearCard);
                    },
                    [Action.EXTORQUIR]: () => {
                        const extorquirCard = turn.getFirstCard() as number;

                        const extorquirCardType = player.getCard(extorquirCard).getType();

                        const bloquearCard = turn.getLastCard();

                        const bloquearCardType = target.getCard(bloquearCard).getType();

                        if (configs.tiposCartas[bloquearCardType].bloquearExtorquir)
                            player.killCard(extorquirCard);
                        else {
                            const extorquirAmount = configs.tiposCartas[extorquirCardType].quantidadeExtorquir;

                            target.removeMoney(extorquirAmount);
                            player.addMoney(extorquirAmount);

                            target.killCard(bloquearCard);
                        }
                    },
                    [Action.ASSASSINAR]: () => {
                        const assassinarCard = turn.getFirstCard() as number;

                        const bloquearCard = turn.getLastCard() as number;

                        const bloquearCardType = target.getCard(bloquearCard).getType();

                        if (configs.tiposCartas[bloquearCardType].bloquearAssassinar)
                            player.killCard(assassinarCard);
                        else {
                            const cardKilledByContestar = (bloquearCard+1)%2;

                            target.killCard(bloquearCard);
                            target.killCard(cardKilledByContestar);
                        }
                    },
                    [Action.INVESTIGAR]: () => {
                        const investigarCard = turn.getFirstCard() as number;

                        const bloquearCard = turn.getLastCard() as number;

                        const bloquearCardType = target.getCard(bloquearCard).getType();

                        if (configs.tiposCartas[bloquearCardType].bloquearInvestigar)
                            player.killCard(investigarCard);
                        else {
                            const cardKilledByContestar = (bloquearCard+1)%2;

                            target.killCard(cardKilledByContestar);
                        }
                    }
                };

                const firstAction = turn.getFirstAction() as keyof typeof bloquearMapper;

                bloquearMapper[firstAction]();
            }
        }

        const lastAction = turn.getLastAction() as keyof typeof contestarMapper;

        contestarMapper[lastAction]();

        turn.addAction(Action.CONTESTAR);
    }
}