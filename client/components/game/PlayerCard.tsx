import Image from "next/image";
import { useEffect, useState } from "react";
import InfluenceCard from "@components/game/InfluenceCard";
import ReligionIcon from "@components/game/ReligionIcon";
import { CardColors, generateColorCard } from "@utils/utils";
import { Action, EnemyPlayer } from "@type/game";
import { ChangeRequest, MenuTypes } from "@type/gameUI";

export default function PlayerCard({
  player,
  performChange
}: {
  player: EnemyPlayer,
  performChange: (changeRequest: ChangeRequest) => void
}) {
  const [ colors, setColors ] = useState<CardColors>()

  useEffect(() => {
    setColors(generateColorCard());
  }, []);

  return (
    <div
      className={`w-auto p-4 mx-3 rounded-2xl ${colors?.cardColor || ""}`}
      id={`gameView-${player.name}Player`}
      data-testid={`gameView-${player.name}Player`}
    >
      <header className={`w-full text-center ${colors?.nameColor || ""} relative`}>
        {player.name}
        {player.religion !== undefined &&
          <button
            id={`gameView-${player.name}ReligionButton`}
            data-testid={`gameView-${player.name}ReligionButton`}
            onClick={() => performChange({
              action: Action.TROCAR_RELIGIAO_OUTRO,
              target: player.name
            })}
          >
            <ReligionIcon
              religion={player.religion}
              className="absolute -right-4 translate-x-[50%] -top-4 -translate-y-[50%]"
            />
          </button>
        }
      </header>
      <div className="w-full flex items-center justify-center gap-2">
        <p className={`text-xl ${colors?.coinColor || ""}`}>
          {player.money}
        </p>
        <button
          id={`gameView-${player.name}ExtorquirButton`}
          data-testid={`gameView-${player.name}ExtorquirButton`}
          onClick={() => performChange({
            action: Action.EXTORQUIR,
            target: player.name
          })}
        >
          <Image
            src="/extorquir.png"
            alt="icone de menos"
            title="extorquir"
            className={`rounded-[100%] ${colors?.minusColor || ""} cursor-pointer hover:scale-110`}
            width={24}
            height={24}
          />
        </button>
      </div>
      <div className="flex gap-2 w-max py-2">
        <button
          id={`gameView-${player.name}FirstAttackableCard`}
          data-testid={`gameView-${player.name}FirstAttackableCard`}
          onClick={() => performChange({
            target: player.name,
            targetCard: 0,
            goTo: MenuTypes.ATTACK
          })}
        >
          <InfluenceCard
            card={player.cards[0].card}
            className={`cursor-pointer${player.cards[0].isDead ? " brightness-50" : ""} hover:scale-110`}
          />
        </button>
        <button
          id={`gameView-${player.name}SecondAttackableCard`}
          data-testid={`gameView-${player.name}SecondAttackableCard`}
          onClick={() => performChange({
            target: player.name,
            targetCard: 1,
            goTo: MenuTypes.ATTACK
          })}
        >
          <InfluenceCard
            card={player.cards[1].card}
            className={`cursor-pointer${player.cards[1].isDead ? " brightness-50" : ""} hover:scale-110`}
          />
        </button>
      </div>
    </div>
  )
}