import Action from "../entity/Action";
import { ActionInfos } from "../service/GameMessageService";

export default class ActionSaver {
    static save(action: Action): ActionInfos {
        const actionMapper: {
            [key in Action]: () => void;
        } = {}

        actionMapper[action]();
    }
}