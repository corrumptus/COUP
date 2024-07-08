import { useEffect, useState } from "react";
import Image from "next/image";
import { Action, Player, Religion } from "@pages/GameView";
import InfluenceCard from "@components/InfluenceCard";
import { MenuTypes } from "@components/GameActionMenu";
import { CardColors, generateColorCard } from "@utils/utils";
import { ChangeRequest } from "@utils/UIChanger";

export default function PlayerCard({
  player,
  performChange
}: {
  player: Omit<Player, "state">,
  performChange: (changeRequest: ChangeRequest) => void
}) {
  const [ colors, setColors ] = useState<CardColors>()

  useEffect(() => {
    setColors(generateColorCard());
  }, []);

  return (
    <div
      className={`w-auto p-4 mx-3 rounded-2xl ${colors?.cardColor || ""}`}
    >
      <header className={`w-full text-center ${colors?.nameColor || ""} relative`}>
        {player.name}
        {player.religion !== undefined &&
          (player.religion === Religion.PROTESTANTE ?
            <Image
              src="/protestante-icon.png"
              alt="biblia"
              title="protestante"
              className="absolute -right-4 translate-x-[50%] -top-4 -translate-y-[50%]"
              onClick={() => performChange({
                action: Action.TROCAR_RELIGIAO_OUTRO,
                target: player.name
              })}
              width={40}
              height={40}
            />
            :
            <Image
              src="/catolico-icon.png"
              alt="cruz catolica"
              title="católico"
              className="absolute -right-4 translate-x-[50%] -top-4 -translate-y-[50%]"
              onClick={() => performChange({
                action: Action.TROCAR_RELIGIAO_OUTRO,
                target: player.name
              })}
              width={40}
              height={40}
            />
          )
        }
      </header>
      <p className={`w-full flex items-center justify-center gap-2 text-xl ${colors?.coinColor || ""}`}>
        {player.money}
        <Image
          src="/extorquir.png"
          alt="icone de menos"
          title="extorquir"
          className={`rounded-[100%] ${colors?.minusColor || ""} cursor-pointer hover:scale-110`}
          onClick={() => performChange({
            action: Action.EXTORQUIR,
            target: player.name,
            goTo: MenuTypes.CARD_CHOOSER
          })}
          width={24}
          height={24}
        />
      </p>
      <div className="flex gap-2 w-max py-2">
        <InfluenceCard
          card={player.cards[0].card}
          customStyle={`cursor-pointer${player.cards[0].isDead ? " brightness-50" : ""} hover:scale-110`}
          onClick={() => performChange({
            target: player.name,
            choosedTargetCard: 0,
            goTo: MenuTypes.ATTACK
          })}
        />
        <InfluenceCard
          card={player.cards[1].card}
          customStyle={`cursor-pointer${player.cards[1].isDead ? " brightness-50" : ""} hover:scale-110`}
          onClick={() => performChange({
            target: player.name,
            choosedTargetCard: 1,
            goTo: MenuTypes.ATTACK
          })}
        />
      </div>
    </div>
  )
}