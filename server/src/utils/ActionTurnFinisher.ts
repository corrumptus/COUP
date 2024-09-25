import Action from "../entity/Action";
import Turn from "../entity/Turn";

export default class ActionTurnFinisher {
    static finish(action: Action, turn: Turn) {
        const actionMapper = {
            [Action.RENDA]: () => ActionTurnFinisher.finishRenda(turn),
            [Action.AJUDA_EXTERNA]: () => ActionTurnFinisher.finishAjudaExterna(),
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
}