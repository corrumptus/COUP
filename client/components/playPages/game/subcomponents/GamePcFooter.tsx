import Image from "next/image";
import { Action, Player } from "@pages/GameView";
import CardGameInfos from "@components/CardGameInfos";
import InfluenceCard from "@components/InfluenceCard";
import { MenuTypes } from "@components/GameActionMenu";
import { Config } from "@utils/socketAPI";
import { ChangeRequest } from "@utils/UIChanger";
import { ACTION } from "next/dist/client/components/app-router-headers";

export default function GamePcFooter({
  player,
  performChange,
  configs
}: {
  player: Player,
  performChange: (changeRequest: ChangeRequest) => void,
  configs: Config
}) {
  return (
    <footer className="flex justify-between relative">
      <div className="flex items-end relative z-[3]">
        <button
          className="bg-[#27b127] border-green-800 border-t-[3px] border-r-[3px] rounded-tr-full aspect-square p-3 hover:scale-110 origin-bottom-left"
          onClick={() => performChange({ goTo: MenuTypes.MONEY })}
        >
          <Image
            src="/openBank.png"
            alt="plus icon"
            className="-translate-x-[15.5%] translate-y-[15.5%] bg-green-300 rounded-3xl"
            width={40}
            height={40}
          />
        </button>
        <span className="flex items-center pl-[26px] pr-4 absolute right-4 z-[-1] border-[3px] border-black h-[75%] bg-red-600 text-yellow-300 translate-x-[90%]">
          {player.money}
        </span>
      </div>
      <div className="flex justify-center items-center gap-10 absolute bottom-0 translate-y-[calc(100%-40px)] group hover:translate-y-0 right-[50%] translate-x-[50%] duration-700 bg-slate-600 p-2.5 rounded-t-2xl">
        <InfluenceCard
          card={player.cards[0].card}
          customStyle={`group-hover:-rotate-[30deg]${player.cards[0].isDead ? " brightness-50" : ""} duration-700`}
        />
        <button
          className="bg-red-800 aspect-square p-2 rounded-full border-4 border-gray-800 hover:border-slate-500 font-bold"
          onClick={() => performChange({
            action: Action.TROCAR,
            goTo: MenuTypes.CARD_CHOOSER
          })}
        >
          Trocar
        </button>
        <InfluenceCard
          card={player.cards[1].card}
          customStyle={`group-hover:rotate-[30deg]${player.cards[1].isDead ? " brightness-50" : ""} duration-700`}
        />
      </div>
      <CardGameInfos
        configs={configs}
        customStyles="absolute right-3 bottom-0 translate-y-[calc(100%-70px)] hover:translate-y-0 duration-700"
      />
    </footer>
  )
}