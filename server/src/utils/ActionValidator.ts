import Action from "../entity/Action";
import CardType from "../entity/CardType";
import Game from "../entity/Game";
import Player from "../entity/player";

export default class ActionValidator {
    static validate(
        game: Game,
        player: Player,
        action: Action,
        card: CardType | undefined,
        selfCard: number | undefined,
        targetName: string | undefined,
        targetCard: number | undefined
    ) {
        
    }
}