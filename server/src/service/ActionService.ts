import Action from "../entity/Action";
import CardType from "../entity/CardType";
import { ActionInfos } from "./GameMessageService";

export default class ActionService {
    static makeAction(
        socketId: string,
        action: Action,
        card?: CardType,
        selfCard?: number,
        targetName?: string,
        targetCard?: number
    ): ActionInfos {
    }
}