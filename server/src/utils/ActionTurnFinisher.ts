import Action from "../entity/Action";
import Game from "../entity/Game";
import Turn from "../entity/Turn";

export default class ActionTurnFinisher {
    static lobbys: {
        [id: number]: Turn
    } = {};

    static finish(action: Action, lobbyId: number, game: Game, turn: Turn) {
        if (
            lobbyId in ActionTurnFinisher.lobbys
            &&
            turn !== ActionTurnFinisher.lobbys[lobbyId]
        ) {
            ActionTurnFinisher.lobbys[lobbyId].finish(false);
            delete ActionTurnFinisher.lobbys[lobbyId];
        }

        const actionMapper = {
            [Action.RENDA]: () => ActionTurnFinisher.finishRenda(turn),
            [Action.AJUDA_EXTERNA]: () => ActionTurnFinisher.finishAjudaExterna(lobbyId, game, turn),
            [Action.TAXAR]: () => ActionTurnFinisher.finishTaxar(lobbyId, game, turn),
            [Action.CORRUPCAO]: () => ActionTurnFinisher.finishCorrupcao(lobbyId, game, turn),
            [Action.EXTORQUIR]: () => ActionTurnFinisher.finishExtorquir(),
            [Action.ASSASSINAR]: () => ActionTurnFinisher.finishAssassinar(),
            [Action.INVESTIGAR]: () => ActionTurnFinisher.finishInvestigar(),
            [Action.GOLPE_ESTADO]: () => ActionTurnFinisher.finishGolpeEstado(turn),
            [Action.TROCAR]: () => ActionTurnFinisher.finishTrocar(lobbyId, game, turn),
            [Action.TROCAR_PROPRIA_RELIGIAO]: () => ActionTurnFinisher.finishTrocarPropriaReligiao(turn),
            [Action.TROCAR_RELIGIAO_OUTRO]: () => ActionTurnFinisher.finishTrocarReligiaoOutro(turn),
            [Action.BLOQUEAR]: () => ActionTurnFinisher.finishBloquear(),
            [Action.CONTESTAR]: () => ActionTurnFinisher.finishContestar(turn),
            [Action.CONTINUAR]: () => ActionTurnFinisher.finishContinuar(turn)
        }

        actionMapper[action]();
    }

    private static finishRenda(turn: Turn) {
        turn.finish();
    }

    private static finishAjudaExterna(lobbyId: number, game: Game, turn: Turn) {
        ActionTurnFinisher.lobbys[lobbyId] = turn;

        game.nextPlayer();
    }

    private static finishTaxar(lobbyId: number, game: Game, turn: Turn) {
        ActionTurnFinisher.lobbys[lobbyId] = turn;

        game.nextPlayer();
    }

    private static finishCorrupcao(lobbyId: number, game: Game, turn: Turn) {
        ActionTurnFinisher.lobbys[lobbyId] = turn;

        game.nextPlayer();
    }

    private static finishExtorquir() {}

    private static finishAssassinar() {}

    private static finishInvestigar() {}

    private static finishGolpeEstado(turn: Turn) {
        turn.finish();
    }

    private static finishTrocar(lobbyId: number, game: Game, turn: Turn) {
        const firstAction = turn.getFirstAction() as Action;

        if (firstAction === Action.INVESTIGAR) {
            turn.finish();
            return;
        }

        ActionTurnFinisher.lobbys[lobbyId] = turn;

        game.nextPlayer();
    }

    private static finishTrocarPropriaReligiao(turn: Turn) {
        turn.finish();
    }

    private static finishTrocarReligiaoOutro(turn: Turn) {
        turn.finish();
    }

    private static finishBloquear() {}

    private static finishContestar(turn: Turn) {
        turn.finish();
    }

    private static finishContinuar(turn: Turn) {
        const firstAction = turn.getFirstAction() as Action;

        if (firstAction !== Action.INVESTIGAR)
            turn.finish();
    }
}