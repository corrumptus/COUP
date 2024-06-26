import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Player } from "@pages/GameView";
import CardGameInfos from "@components/CardGameInfos";
import InfluenceCard from "@components/InfluenceCard";
import { MenuTypes } from "@components/GameActionMenu";
import { Config } from "@utils/socketAPI";

export default function GamePcFooter({
  player,
  changeMenuType,
  setRequeriments,
  configs
}: {
  player: Player,
  changeMenuType: (menuType: MenuTypes | undefined) => void,
  setRequeriments: Dispatch<SetStateAction<{[key: string]: any}>>,
  configs: Config
}) {
  return (
    <footer className="flex justify-between relative">
      <div className="flex items-end relative z-[3]">
        <button
          className="bg-[#27b127] border-green-800 border-t-[3px] border-r-[3px] rounded-tr-full aspect-square p-3 hover:scale-110 origin-bottom-left"
          onClick={() => changeMenuType("money")}
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
      <div className="flex justify-center gap-10 absolute bottom-0 translate-y-[calc(100%-40px)] group hover:translate-y-0 right-[50%] translate-x-[50%] duration-700 bg-slate-600 p-2.5 rounded-t-2xl">
        <InfluenceCard
          card={player.cards[0].card}
          customStyle={`group-hover:-rotate-[30deg]${player.cards[0].isDead ? " opacity-80" : ""} duration-700 cursor-pointer`}
          onClick={() => {
            if (player.cards[0].isDead)
              return;

            changeMenuType("selfCard");
            setRequeriments({ "player": player.name, "playerCard": 0 });
          }}
        />
        <InfluenceCard
          card={player.cards[1].card}
          customStyle={`group-hover:rotate-[30deg]${player.cards[1].isDead ? " opacity-80" : ""} duration-700 cursor-pointer`}
          onClick={() => {
            if (player.cards[1].isDead)
              return;

            changeMenuType("selfCard");
            setRequeriments({ "player": player.name, "playerCard": 1 });
          }}
        />
      </div>
      <CardGameInfos
        configs={configs}
        customStyles="absolute right-3 bottom-0 translate-y-[calc(100%-70px)] hover:translate-y-0 duration-700"
      />
    </footer>
  )
}