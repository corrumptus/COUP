import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Player, Religion } from "@pages/GameView";
import CardGameInfos from "@components/CardGameInfos";
import InfluenceCard from "@components/InfluenceCard";
import { MenuTypes } from "@components/GameActionMenu";
import { Config, COUPSocket } from "@utils/socketAPI";

export default function GameMobileMenu({
  player,
  changeMenuType,
  setRequeriments,
  configs,
  isOpen,
  socket
}: {
  player: Player,
  changeMenuType: (menuType: MenuTypes | undefined) => void,
  setRequeriments: Dispatch<SetStateAction<{[key: string]: any}>>,
  configs: Config,
  isOpen: boolean,
  socket: COUPSocket
}) {
  return (
    <aside className={`h-full p-3 flex flex-col items-center gap-6 absolute ${isOpen ? "right-0" : "-right-full"} z-[4] ease-linear duration-1000 bg-slate-700`}>
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
              onClick={() => player.money < configs.quantidadeMinimaGolpeEstado
                && socket.emit("trocarReligiaoPropria")}
              width={40}
              height={40}
            />
            :
            <Image
              src="/protestante-icon.png"
              alt="biblia"
              title="protestante"
              onClick={() => player.money < configs.quantidadeMinimaGolpeEstado
                && socket.emit("trocarReligiaoPropria")}
              width={40}
              height={40}
            />
          )
        }
      </div>
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
      <CardGameInfos configs={configs}/>
    </aside>
  )
}