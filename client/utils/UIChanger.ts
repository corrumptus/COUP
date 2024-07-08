"use client";

import { useState } from "react";
import { GameState } from "@pages/GameView";
import { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";

export type ChangeRequest = ActionRequeriments & { goTo?: MenuTypes };

export default function useUIChanger() {
    const [ menuType, setMenuType ] = useState<MenuTypes>(MenuTypes.CLOSED);
    const [ requeriments, setRequeriments ] = useState<ActionRequeriments>({});

    return [
        menuType,
        requeriments,
        (gameState: GameState, newRequeriments: ChangeRequest) => {
            const [ nextMenuType, currentRequeriments ] =
                performUIChange(gameState, menuType, requeriments, newRequeriments);

            setMenuType(nextMenuType);
            setRequeriments(currentRequeriments);
        }
    ] as const;
}

function performUIChange(
    gameState: GameState,
    menuType: MenuTypes,
    requeriments: ActionRequeriments,
    newRequeriments?: ChangeRequest
): readonly [MenuTypes, ActionRequeriments] {
    throw new Error("TODO: function not implemented");
}