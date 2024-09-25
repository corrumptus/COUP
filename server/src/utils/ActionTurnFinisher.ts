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
            [Action.TAXAR]: () => ActionTurnFinisher.finishTaxar(),
            [Action.CORRUPCAO]: () => ActionTurnFinisher.finishCorrupcao(),
            [Action.EXTORQUIR]: () => ActionTurnFinisher.finishExtorquir(),
            [Action.ASSASSINAR]: () => ActionTurnFinisher.finishAssassinar(),
            [Action.INVESTIGAR]: () => ActionTurnFinisher.finishInvestigar(),
            [Action.GOLPE_ESTADO]: () => ActionTurnFinisher.finishGolpeEstado(),
            [Action.TROCAR]: () => ActionTurnFinisher.finishTrocar(),
            [Action.TROCAR_PROPRIA_RELIGIAO]: () => ActionTurnFinisher.finishTrocarPropriaReligiao(),
            [Action.TROCAR_RELIGIAO_OUTRO]: () => ActionTurnFinisher.finishTrocarReligiaoOutro(),
            [Action.BLOQUEAR]: () => ActionTurnFinisher.finishBloquear(),
            [Action.CONTESTAR]: () => ActionTurnFinisher.finishContestar(),
            [Action.CONTINUAR]: () => ActionTurnFinisher.finishContinuar()
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
}