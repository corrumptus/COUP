import { useEffect, useState } from "react";
import { Action, Player, Religion } from "../GameView";
import InfluenceCard from "./InfluenceCard";
import Image from "next/image";
import { CardColors, generateColorCard } from "@/app/utils/utils";
import { MenuTypes } from "./GameActionMenu";
import socket from "@/app/utils/socketAPI";

export default function PlayerCard({
  player,
  setAction,
  setMenuType,
  setRequeriments
}: {
  player: Player,
  setAction: (action: Action) => void,
  setMenuType: (menuType: MenuTypes | undefined) => void,
  setRequeriments: (requeriment: {[key: string]: any;}) => void
}) {
  const [ colors, setColors ] = useState<CardColors>()

  useEffect(() => {
    setColors(generateColorCard())
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
              onClick={() => socket.emit("trocarReligiaoOutro", player.name)}
              width={40}
              height={40}
            />
            :
            <Image
              src="/catolico-icon.png"
              alt="cruz catolica"
              title="católico"
              className="absolute -right-4 translate-x-[50%] -top-4 -translate-y-[50%]"
              onClick={() => socket.emit("trocarReligiaoOutro", player.name)}
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
            setAction(Action.EXTORQUIR)
            setMenuType("cardChooser")
            setRequeriments({ "player": player.name })
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

            setMenuType("othersCard")
            setRequeriments({ "player": player.name, "playerCard": 0 })
          }}
        />
        <InfluenceCard
          card={player.cards[1].card}
          customStyle={`cursor-pointer${player.cards[1].isDead ? " opacity-80" : ""} hover:scale-110`}
          onClick={() => {
            if (player.cards[1].isDead)
              return;

            setMenuType("othersCard")
            setRequeriments({ "player": player.name, "playerCard": 1 })
          }}
        />
      </div>
    </div>
  )
}