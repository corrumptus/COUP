import Action from "../entity/Action";
import ActionHandler from "./ActionHandler";
import AjudaExternaHandler from "./AjudaExternaHandler";
import AssassinarHandler from "./AssassinarHandler";
import BloquearHandler from "./BloquearHandler";
import ContestarHandler from "./ContestarHandler";
import ContinuarHandler from "./ContinuarHandler";
import CorrupcaoHandler from "./CorrupcaoHandler";
import ExtorquirHandler from "./ExtorquirHandler";
import GolpeEstadoHandler from "./GolpeEstadoHandler";
import InvestigarHandler from "./InvestigarHandler";
import RendaHandler from "./RendaHandler";
import TaxarHandler from "./TaxarHandler";
import TrocarHandler from "./TrocarHandler";
import trocarPropriaReligiaoHandler from "./TrocarPropriaReligiao";
import trocarReligiaoOutroHandler from "./TrocarReligiaoOutroHandler";

export default class ActionHandlerFactory {
    static create(action: Action): ActionHandler {
        switch (action) {
            case Action.RENDA: return new RendaHandler();
            case Action.AJUDA_EXTERNA: return new AjudaExternaHandler();
            case Action.TAXAR: return new TaxarHandler();
            case Action.CORRUPCAO: return new CorrupcaoHandler();
            case Action.EXTORQUIR: return new ExtorquirHandler();
            case Action.ASSASSINAR: return new AssassinarHandler();
            case Action.INVESTIGAR: return new InvestigarHandler();
            case Action.GOLPE_ESTADO: return new GolpeEstadoHandler();
            case Action.TROCAR: return new TrocarHandler();
            case Action.TROCAR_PROPRIA_RELIGIAO: return new trocarPropriaReligiaoHandler();
            case Action.TROCAR_RELIGIAO_OUTRO: return new trocarReligiaoOutroHandler();
            case Action.BLOQUEAR: return new BloquearHandler();
            case Action.CONTESTAR: return new ContestarHandler();
            case Action.CONTINUAR: return new ContinuarHandler();
            default: throw new Error(`${action} doesnt have a action handler implementation`);
        }
    }
}