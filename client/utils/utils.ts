import type Config from "@type/config";
import { Action, Card, ContextType, GameState } from "@type/game";
import { MenuTypes } from "@type/gameUI";
import type { Differ } from "@type/utils";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";

export function generateColorCard(isDead: boolean = false): {
    cardColor: string,
    nameColor: string,
    coinColor: string,
    minusColor: string,
} {
    if (isDead) return {
        cardColor: "bg-slate-500",
        nameColor: "text-white",
        coinColor: "text-yellow-200",
        minusColor: "bg-red-300"
    }

    const colors = [
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
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}

export function objectDiff<T>(base: T, differ: T): Differ<T> {
    const diff: Differ<T> = {};

    for (let key in base) {
        if (typeof base[key] !== "object") {
            if (base[key] !== differ[key])
                diff[key] = [base[key], differ[key]] as typeof diff[typeof key];
        } else {
            let diffDeep = objectDiff(base[key], differ[key]);

            if (Object.keys(diffDeep).length !== 0)
                diff[key] = diffDeep as typeof diff[typeof key];
        }
    }

    return diff;
}

export function configDiff(configs: Config): Differ<Config> {
  return objectDiff(COUPDefaultConfigs, configs);
}

export function getChoosableCards<T extends Action>(
    action: T,
    configs: Config,
    prevAction: T extends Action.BLOQUEAR ? Action : undefined
): Card[] {
    return Object.entries(configs.tiposCartas)
        .filter(([cardName, cardInfos]) => {
            if (action === Action.BLOQUEAR) {
                if (prevAction === Action.AJUDA_EXTERNA)
                    return cardInfos.taxar;

                if (prevAction === Action.TAXAR)
                    return cardInfos.bloquearTaxar;

                if (prevAction === Action.EXTORQUIR)
                    return cardInfos.bloquearExtorquir;

                if (prevAction === Action.ASSASSINAR)
                    return cardInfos.bloquearAssassinar;

                if (prevAction === Action.INVESTIGAR)
                    return cardInfos.bloquearInvestigar;

                if (prevAction === Action.TROCAR)
                    return cardInfos.bloquearTrocar;
            }

            if (action === Action.CORRUPCAO) {
                const cartasParaCorrupcao = configs.religiao.cartasParaCorrupcao;
                return cartasParaCorrupcao[cardName as keyof typeof cartasParaCorrupcao];
            }

            return cardInfos[action as keyof typeof cardInfos] as boolean;
        })
        .map(([card, _]) => card) as Card[];
}

export function menuTypeFrom(context: GameState["context"]): MenuTypes | undefined {
    if (context.type === ContextType.BEING_ATTACKED)
        return context.action === Action.BLOQUEAR ?
            MenuTypes.BLOCK_DEFENSE
            :
            MenuTypes.DEFENSE;

    if (context.type === ContextType.INVESTIGATING)
        return MenuTypes.INVESTIGATING;

    return undefined;
}