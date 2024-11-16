import Action from "../entity/Action";
import ActionHandler from "./ActionHandler";

export default class ActionHandlerFactory {
    static create(action: Action): ActionHandler {
        throw new Error(`${action} doesnt have a action handler implementation`);
    }
}