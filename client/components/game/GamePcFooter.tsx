import Image from "next/image";
import CardGameInfos from "@components/game/CardGameInfos";
import InfluenceCard from "@components/game/InfluenceCard";
import Config from "@type/config";
import { Action, Player } from "@type/game";
import { ChangeRequest, MenuTypes } from "@type/gameUI";

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
          id="gameView-moneyButton"
          data-testid="gameView-moneyButton"
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
          id="gameView-playerMoney"
          data-testid="gameView-playerMoney"
        >
          {player.money}
        </span>
      </div>
      <div className="flex justify-center items-center gap-10 absolute bottom-0 translate-y-[calc(100%-40px)] group hover:translate-y-0 right-[50%] translate-x-[50%] duration-700 bg-slate-600 p-2.5 rounded-t-2xl">
        <span
          id="gameView-playerFirstInfluenceCard"
          data-testid="gameView-playerFirstInfluenceCard"
        >
          <InfluenceCard
            card={player.cards[0].card}
            className={`group-hover:-rotate-[30deg]${player.cards[0].isDead ? " brightness-50" : ""} duration-700`}
          />
        </span>
        <button
          className="bg-red-800 aspect-square p-2 rounded-full border-4 border-gray-800 hover:border-slate-500 font-bold"
          onClick={() => performChange({ action: Action.TROCAR })}
          id="gameView-playerChangeButton"
          data-testid="gameView-playerChangeButton"
        >
          Trocar
        </button>
        <span
          id="gameView-playerSecondInfluenceCard"
          data-testid="gameView-playerSecondInfluenceCard"
        >
          <InfluenceCard
            card={player.cards[1].card}
            className={`group-hover:rotate-[30deg]${player.cards[1].isDead ? " brightness-50" : ""} duration-700`}
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