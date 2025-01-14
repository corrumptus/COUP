import Image from "next/image";
import CardGameInfos from "@components/game/CardGameInfos";
import InfluenceCard from "@components/game/InfluenceCard";
import ReligionIcon from "@components/game/ReligionIcon";
import type Config from "@type/config";
import { Action, SelfPlayer } from "@type/game";
import { CardVersion, ChangeRequest, MenuTypes } from "@type/gameUI";

export default function GameMobileMenu({
  player,
  playerCardVersions,
  performChange,
  configs,
  isOpen
}: {
  player: SelfPlayer,
  playerCardVersions: [CardVersion, CardVersion],
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
          <button
            id="gameView-playerReligionButton"
            data-testid="gameView-playerReligionButton"
            onClick={() => performChange({ action: Action.TROCAR_PROPRIA_RELIGIAO })}
          >
            <ReligionIcon religion={player.religion} />
          </button>
        }
      </div>
      <button
        className="bg-red-600 p-2 rounded-full border-4 border-gray-800 hover:border-slate-500 font-bold"
        id="gameView-playerChangeButton"
        data-testid="gameView-playerChangeButton"
        onClick={() => performChange({ action: Action.TROCAR })}
      >
        Trocar Cartas
      </button>
      <span
        id="gameView-playerFirstInfluenceCard"
        data-testid="gameView-playerFirstInfluenceCard"
      >
        <InfluenceCard
          card={player.cards[0].card}
          cardVersion={playerCardVersions[0]}
          className={`group-hover:-rotate-[30deg]${player.cards[0].isDead ? " brightness-50" : ""} duration-700`}
        />
      </span>
      <span
        id="gameView-playerSecondInfluenceCard"
        data-testid="gameView-playerSecondInfluenceCard"
      >
        <InfluenceCard
          card={player.cards[1].card}
          cardVersion={playerCardVersions[1]}
          className={`group-hover:rotate-[30deg]${player.cards[1].isDead ? " brightness-50" : ""} duration-700`}
        />
      </span>
      <CardGameInfos configs={configs}/>
    </aside>
  )
}