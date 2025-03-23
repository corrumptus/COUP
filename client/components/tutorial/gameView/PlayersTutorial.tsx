import Image from "next/image";
import InfluenceCard from "@components/game/InfluenceCard";
import ReligionIcon from "@components/game/ReligionIcon";
import { type EnemyPlayer } from "@type/game";
import { CardVersion } from "@type/gameUI";
import { PlayerCardColor } from "@utils/utils";

export default function PlayersTutorial({
  players,
  colors,
  versions
}: {
  players: EnemyPlayer[],
  colors: PlayerCardColor,
  versions: { first: CardVersion, second: CardVersion }[]
}) {
  return (
    <div className="flex items-center gap-4 overflow-auto game_scrollbar py-7">
      {players.map((player, i) =>
        <div
          key={player.name}
          className={`w-auto p-4 mx-3 rounded-2xl ${colors.cardColor}`}
        >
          <header className={`w-full text-center ${colors.nameColor} relative`}>
            {player.name}
            {player.religion !== undefined &&
              <button
                className={`absolute -right-4 translate-x-[50%] -top-4 -translate-y-[50%]`}
              >
                <ReligionIcon religion={player.religion} />
              </button>
            }
          </header>
          <div className="w-full flex items-center justify-center gap-2">
            <p className={`text-xl ${colors.coinColor}`}>
              {player.money}
            </p>
            <button
              id={`gameView-${player.name}ExtorquirButton`}
              data-testid={`gameView-${player.name}ExtorquirButton`}
            >
              <Image
                src="/extorquir.png"
                alt="icone de menos"
                title="extorquir"
                className={`rounded-[100%] ${colors.minusColor} cursor-pointer hover:scale-110`}
                width={24}
                height={24}
              />
            </button>
          </div>
          <div className="flex gap-2 w-max py-2">
            <button
              className={
                `cursor-pointer hover:scale-110${player.cards[0].isDead ? " brightness-50" : ""}`
              }
            >
              <InfluenceCard
                card={player.cards[0].card}
                cardVersion={versions[i].first}
              />
            </button>
            <button
              className={
                `cursor-pointer hover:scale-110${player.cards[1].isDead ? " brightness-50" : ""}`
              }
            >
              <InfluenceCard
                card={player.cards[1].card}
                cardVersion={versions[i].second}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}