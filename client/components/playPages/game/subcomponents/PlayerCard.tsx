import { useEffect, useState } from "react";
import Image from "next/image";
import { Action, Player, Religion } from "@pages/GameView";
import InfluenceCard from "@components/InfluenceCard";
import { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";
import { CardColors, generateColorCard, menuTypeFrom } from "@utils/utils";
import { COUPSocket } from "@utils/socketAPI";

export default function PlayerCard({
  player,
  changeReligion,
  changeMenuType,
  addRequeriment,
  socket
}: {
  player: Omit<Player, "state">,
  changeReligion: (playerName: string) => void,
  changeMenuType: (menuType: MenuTypes | undefined) => void,
  addRequeriment: <K extends keyof ActionRequeriments>
    (requerimentType: K, requeriment: ActionRequeriments[K]) => void,
  socket: COUPSocket
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
              onClick={() => changeReligion(player.name)}
              width={40}
              height={40}
            />
            :
            <Image
              src="/catolico-icon.png"
              alt="cruz catolica"
              title="católico"
              className="absolute -right-4 translate-x-[50%] -top-4 -translate-y-[50%]"
              onClick={() => changeReligion(player.name)}
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
          onClick={() => {
            addRequeriment("action", Action.EXTORQUIR);
            addRequeriment("target", player.name);
            changeMenuType(MenuTypes.CARD_CHOOSER);
          }}
          width={24}
          height={24}
        />
      </p>
      <div className="flex gap-2 w-max py-2">
        <InfluenceCard
          card={player.cards[0].card}
          customStyle={`cursor-pointer${player.cards[0].isDead ? " opacity-80" : ""} hover:scale-110`}
          onClick={() => {
            if (player.cards[0].isDead)
              return;

            addRequeriment("target", player.name);
            addRequeriment("choosedTargetCard", 0);
            changeMenuType(MenuTypes.OTHERS_CARD);
          }}
        />
        <InfluenceCard
          card={player.cards[1].card}
          customStyle={`cursor-pointer${player.cards[1].isDead ? " opacity-80" : ""} hover:scale-110`}
          onClick={() => {
            if (player.cards[1].isDead)
              return;

            addRequeriment("target", player.name);
            addRequeriment("choosedTargetCard", 1);
            changeMenuType(MenuTypes.OTHERS_CARD);
          }}
        />
      </div>
    </div>
  )
}