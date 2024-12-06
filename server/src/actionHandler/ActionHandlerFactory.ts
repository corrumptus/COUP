import ActionHandler from "@actionHandlers/ActionHandler";
import AjudaExternaHandler from "@actionHandlers/AjudaExternaHandler";
import AssassinarHandler from "@actionHandlers/AssassinarHandler";
import BloquearHandler from "@actionHandlers/BloquearHandler";
import ContestarHandler from "@actionHandlers/ContestarHandler";
import ContinuarHandler from "@actionHandlers/ContinuarHandler";
import CorrupcaoHandler from "@actionHandlers/CorrupcaoHandler";
import ExtorquirHandler from "@actionHandlers/ExtorquirHandler";
import GolpeEstadoHandler from "@actionHandlers/GolpeEstadoHandler";
import InvestigarHandler from "@actionHandlers/InvestigarHandler";
import RendaHandler from "@actionHandlers/RendaHandler";
import TaxarHandler from "@actionHandlers/TaxarHandler";
import TrocarHandler from "@actionHandlers/TrocarHandler";
import trocarPropriaReligiaoHandler from "@actionHandlers/TrocarPropriaReligiao";
import trocarReligiaoOutroHandler from "@actionHandlers/TrocarReligiaoOutroHandler";
import Action from "@entitys/Action";

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