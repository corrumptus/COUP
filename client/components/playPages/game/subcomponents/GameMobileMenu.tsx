import Image from "next/image";
import { Action, Player, Religion } from "@pages/GameView";
import CardGameInfos from "@components/CardGameInfos";
import InfluenceCard from "@components/InfluenceCard";
import { MenuTypes } from "@components/GameActionMenu";
import { Config } from "@utils/socketAPI";
import { ChangeRequest } from "@utils/UIChanger";

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
      <div className="flex justify-between w-full">
        <span className="flex items-center gap-2 text-yellow-200 text-lg">
          {player.money}
          <Image
            src="/openBank.png"
            alt="plus icon"
            className="bg-green-300 rounded-3xl"
            width={35}
            height={35}
          />
        </span>
        {player.religion && (
          player.religion === Religion.CATOLICA ?
            <Image
              src="/catolico-icon.png"
              alt="cruz católica"
              title="católico"
              onClick={() => performChange({ action: Action.TROCAR_PROPRIA_RELIGIAO })}
              width={40}
              height={40}
            />
            :
            <Image
              src="/protestante-icon.png"
              alt="biblia"
              title="protestante"
              onClick={() => performChange({ action: Action.TROCAR_PROPRIA_RELIGIAO })}
              width={40}
              height={40}
            />
          )
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