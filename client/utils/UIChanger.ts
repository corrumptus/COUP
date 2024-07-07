import { GameState } from "@pages/GameView";
import { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";

export const gameActuals: {
    menuType: MenuTypes | undefined,
    requeriments: ActionRequeriments
} = {
    menuType: undefined,
    requeriments: {}
}

export default function performUIChange(
    gameState: GameState,
    prevMenuType: MenuTypes | undefined,
    requeriments?: ActionRequeriments,
) {
    throw new Error("TODO: function not implemented");
}