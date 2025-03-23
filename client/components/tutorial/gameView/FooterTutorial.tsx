import Image from "next/image";
import CardGameInfos from "@components/game/CardGameInfos";
import InfluenceCard from "@components/game/InfluenceCard";
import type Config from "@type/config";
import { SelfPlayer } from "@type/game";
import { CardVersion } from "@type/gameUI";

export default function FooterTutorial({
  player,
  configs,
  cardVersions
}: {
  player: SelfPlayer,
  configs: Config,
  cardVersions: { first: CardVersion, second: CardVersion }
}) {
  return (
    <footer className="flex justify-between relative">
      <div className="flex items-end relative z-[3]">
        <button
          className="bg-[#27b127] border-green-800 border-t-[3px] border-r-[3px] rounded-tr-full aspect-square p-3 hover:scale-110 origin-bottom-left"
        >
          <Image
            src="/openBank.png"
            alt="plus icon"
            className="-translate-x-[15.5%] translate-y-[15.5%] bg-green-300 rounded-3xl"
            width={40}
            height={40}
          />
        </button>
        <span
          className="flex items-center pl-[26px] pr-4 absolute right-4 z-[-1] border-[3px] border-black h-[75%] bg-red-600 text-yellow-300 translate-x-[90%]"
        >
          {player.money}
        </span>
      </div>
      <div className="flex justify-center items-center gap-10 absolute bottom-0 translate-y-[calc(100%-40px)] group hover:translate-y-0 right-[50%] translate-x-[50%] duration-700 bg-slate-600 p-2.5 rounded-t-2xl">
        <span
          className={`group-hover:-rotate-[30deg] duration-700${player.cards[0].isDead ? " brightness-50" : ""}`}
        >
          <InfluenceCard
            card={player.cards[0].card}
            cardVersion={cardVersions.first}
          />
        </span>
        <button
          className="bg-red-800 aspect-square p-2 rounded-full border-4 border-gray-800 hover:border-slate-500 font-bold"
        >
          Trocar
        </button>
        <span
          className={`group-hover:rotate-[30deg] duration-700${player.cards[1].isDead ? " brightness-50" : ""}`}
        >
          <InfluenceCard
            card={player.cards[1].card}
            cardVersion={cardVersions.second}
          />
        </span>
      </div>
      <CardGameInfos
        configs={configs}
        customStyles="absolute right-3 bottom-0 translate-y-[calc(100%-70px)] hover:translate-y-0 duration-700"
      />
    </footer>
  )
}