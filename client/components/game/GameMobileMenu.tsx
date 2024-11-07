import Image from "next/image";
import CardGameInfos from "@components/game/CardGameInfos";
import InfluenceCard from "@components/game/InfluenceCard";
import ReligionButton from "@components/game/ReligionButton";
import Config from "@type/config";
import { Action, Player } from "@type/game";
import { ChangeRequest, MenuTypes } from "@type/gameUI";

export default function GameMobileMenu({
  player,
  performChange,
  configs,
  isOpen
}: {
  player: Player,
  performChange: (changeRequest: ChangeRequest) => void,
  configs: Config,
  isOpen: boolean
}) {
  return (
    <aside className={`h-full p-3 flex flex-col items-center gap-6 absolute ${isOpen ? "right-0" : "-right-full"} z-[4] ease-linear duration-1000 bg-slate-700 overflow-auto`}>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <span
            className="text-yellow-200 text-lg"
            id="gameView-playerMoney"
            data-testid="gameView-playerMoney"
          >
            {player.money}
          </span>
          <button
            onClick={() => performChange({ goTo: MenuTypes.MONEY })}
            id="gameView-moneyButton"
            data-testid="gameView-moneyButton"
          >
            <Image
              src="/openBank.png"
              alt="plus icon"
              className="bg-green-300 rounded-3xl"
              width={35}
              height={35}
            />
          </button>
        </div>
        {player.religion !== undefined &&
          <ReligionButton
            religion={player.religion}
            onClick={() => performChange({ action: Action.TROCAR_PROPRIA_RELIGIAO })}
          />
        }
      </div>
      <button
        className="bg-red-600 p-2 rounded-full border-4 border-gray-800 hover:border-slate-500 font-bold"
        onClick={() => performChange({ action: Action.TROCAR })}
      >
        Trocar Cartas
      </button>
      <InfluenceCard
        card={player.cards[0].card}
        customStyle={`group-hover:-rotate-[30deg]${player.cards[0].isDead ? " brightness-50" : ""} duration-700`}
      />
      <InfluenceCard
        card={player.cards[1].card}
        customStyle={`group-hover:rotate-[30deg]${player.cards[1].isDead ? " brightness-50" : ""} duration-700`}
      />
      <CardGameInfos configs={configs}/>
    </aside>
  )
}