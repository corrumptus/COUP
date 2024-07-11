import { useEffect, useState } from "react";
import { Action, Card, PlayerState } from "@pages/GameView";
import { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";
import { Config } from "@utils/socketAPI";

export interface CardColors {
    cardColor: string
    nameColor: string
    coinColor: string
    minusColor: string
}

export function generateColorCard(isDead: boolean = false): CardColors {
    if (isDead) return {
        cardColor: "bg-slate-500",
        nameColor: "text-white",
        coinColor: "text-yellow-200",
        minusColor: "bg-red-300"
    }

    const colors: CardColors[] = [
        {
            cardColor: "bg-red-800",
            nameColor: "text-white",
            coinColor: "text-yellow-300",
            minusColor: "bg-red-300"
        },
        {
            cardColor: "bg-gray-900",
            nameColor: "text-white",
            coinColor: "text-yellow-300",
            minusColor: "bg-red-500"
        },
        {
            cardColor: "bg-stone-800",
            nameColor: "text-white",
            coinColor: "text-yellow-300",
            minusColor: "bg-red-500"
        },
        {
            cardColor: "bg-orange-500",
            nameColor: "text-black",
            coinColor: "text-yellow-200",
            minusColor: "bg-red-500"
        },
        {
            cardColor: "bg-lime-600",
            nameColor: "text-black",
            coinColor: "text-yellow-300",
            minusColor: "bg-red-300"
        },
        {
            cardColor: "bg-emerald-500",
            nameColor: "text-white",
            coinColor: "text-yellow-200",
            minusColor: "bg-red-300"
        },
        {
            cardColor: "bg-cyan-400",
            nameColor: "text-black",
            coinColor: "text-yellow-200",
            minusColor: "bg-red-300"
        },
        {
            cardColor: "bg-blue-600",
            nameColor: "text-white",
            coinColor: "text-yellow-300",
            minusColor: "bg-red-300"
        },
        {
            cardColor: "bg-indigo-600",
            nameColor: "text-white",
            coinColor: "text-yellow-200",
            minusColor: "bg-red-500"
        },
        {
            cardColor: "bg-violet-800",
            nameColor: "text-white",
            coinColor: "text-yellow-200",
            minusColor: "bg-red-500"
        },
        {
            cardColor: "bg-fuchsia-500",
            nameColor: "text-white",
            coinColor: "text-yellow-200",
            minusColor: "bg-red-500"
        }
    ]

    return colors[Math.floor(Math.random() * colors.length)];
}

export function useDeviceWidth() {
    const [width, setWidth] = useState(0)

    function resize() {
        setWidth(window.screen.width)
    }

    useEffect(() => {
        resize();

        window.addEventListener('resize', resize);

        return () =>
            window.removeEventListener('resize', resize);
    }, []);

    return width
}

export type Differ<T> = {
    [P in keyof T]?: Differ<T[P]> | T[P][];
}

export function objectDiff<T>(base: T, differ: T): Differ<T> {
    const diff: Differ<T> = {};

    for (let key in base) {
        if (typeof base[key] !== "object") {
            if (base[key] !== differ[key])
                diff[key] = [base[key], differ[key]];
        } else {
            let diffDeep = objectDiff(base[key], differ[key]);

            if (Object.keys(diffDeep).length !== 0)
                diff[key] = diffDeep;
        }
    }

    return diff;
}

export function getChoosableCards(
    configs: Config,
    requeriments: ActionRequeriments
): Card[] {
    return Object.entries(configs.tiposCartas)
        .filter(([cardName, cardInfos]) => {
            if (requeriments.action === Action.CORRUPCAO) {
                const cartasParaCorrupcao = configs.religiao.cartasParaCorrupcao;
                return cartasParaCorrupcao[cardName as keyof typeof cartasParaCorrupcao];
            }

            return cardInfos[requeriments.action as keyof typeof cardInfos] as boolean;
        })
        .map(([card, _]) => card) as Card[];
}

export function menuTypeFrom(playerState: PlayerState): MenuTypes | undefined {
    if (playerState === PlayerState.BEING_ATTACKED)
        return MenuTypes.DEFENSE;

    if (playerState === PlayerState.BEING_BLOCKED)
        return MenuTypes.BLOCK_DEFENSE;

    if (playerState === PlayerState.INVESTIGATING)
        return MenuTypes.INVESTIGATING;

    return undefined;
}