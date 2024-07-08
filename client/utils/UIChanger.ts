"use client";

import { useState } from "react";
import { GameState } from "@pages/GameView";
import { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";

export default function useUIChanger() {
    const [ menuType, setMenuType ] = useState<MenuTypes | undefined>(undefined);
    const [ requeriments, setRequeriments ] = useState<ActionRequeriments>({});

    return [
        menuType,
        (gameState: GameState, newRequeriments: ActionRequeriments & { goTo?: MenuTypes }) => {
            const [ nextMenuType, currentRequeriments ] =
                performUIChange(gameState, menuType, requeriments, newRequeriments);

            setMenuType(nextMenuType);
            setRequeriments(currentRequeriments);
        }
    ] as const;
}

function performUIChange(
    gameState: GameState,
    menuType: MenuTypes | undefined,
    requeriments: ActionRequeriments,
    newRequeriments?: ActionRequeriments & { goTo?: MenuTypes }
): readonly [MenuTypes | undefined, ActionRequeriments] {
    throw new Error("TODO: function not implemented");
}