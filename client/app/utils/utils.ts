import { useEffect, useState } from "react"

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
  [ P in keyof T]: Partial<Differ<T[P]>> | T[P][]
}

export function objectDiff<T extends Record<string, any>>(base: T, differ: T): Partial<Differ<T>> {
  const diff: Partial<Differ<T>> = {};

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