import Image from "next/image";
import ConfigDiff from "../components/playPages/ConfigDiff";
import GameActionMenu from "@components/GameActionMenu";
import GamePcFooter from "@components/GamePcFooter";
import Players from "../components/playPages/Players";
import NextPerson from "../components/playPages/NextPerson";
import { configDiff } from "@utils/socketAPI";
import Toasters from "@utils/Toasters";
import { Action, GameState, Religion } from "@type/game";
import {
  ActionRequeriments,
  ChangeRequest,
  MenuTypes
} from "@type/gameUI";

export default function GamePCView({
  isDiffsVisible,
  closeDiffs,
  isNextPersonVisible,
  closeNextPerson,
  gameState,
  menuType,
  requeriments,
  performChange,
  leave
}: {
  isDiffsVisible: boolean,
  closeDiffs: () => void,
  isNextPersonVisible: boolean,
  closeNextPerson: () => void,
  gameState: GameState,
  menuType: MenuTypes,
  requeriments: ActionRequeriments
  performChange: (changeRequest: ChangeRequest) => void,
  leave: () => void
}) {
  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex justify-between text-2xl gap-2 p-1.5 pr-2 bg-[#eaaf73]">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={leave}
        >
          <Image
            src="/sair-lobby.png"
            alt="seta para a esquerda"
            className="hover:drop-shadow-lg"
            width={40}
            height={40}
          />
          <span>Sair</span>
        </div>
      </header>
      <main className="h-full flex flex-col relative overflow-hidden bg-[url(../public/game-page.png)] bg-cover bg-bottom">
        <Toasters />
        {gameState.player.religion && (
          gameState.player.religion === Religion.CATOLICA ?
            <Image
              src="/catolico-icon.png"
              alt="cruz católica"
              title="católico"
              className="absolute top-0 left-0 cursor-pointer hover:scale-110"
              onClick={() => performChange({ action: Action.TROCAR_PROPRIA_RELIGIAO })}
              width={40}
              height={40}
            />
            :
            <Image
              src="/protestante-icon.png"
              alt="biblia"
              title="protestante"
              className="absolute top-0 left-0 cursor-pointer hover:scale-110"
              onClick={() => performChange({ action: Action.TROCAR_PROPRIA_RELIGIAO })}
              width={40}
              height={40}
            />
          )
        }
        {isDiffsVisible &&
          <ConfigDiff
            configDiff={configDiff(gameState.game.configs)}
            disappear={closeDiffs}
          />
        }
        <Players
          players={gameState.game.players}
          performChange={performChange}
        />
        <GamePcFooter
          player={gameState.player}
          performChange={performChange}
          configs={gameState.game.configs}
        />
        {menuType !== MenuTypes.CLOSED &&
          <GameActionMenu
            type={menuType}
            gameState={gameState}
            requeriments={requeriments}
            performChange={performChange}
          />
        }
        {isNextPersonVisible &&
          <NextPerson person={gameState.game.currentPlayer} closeNextPerson={closeNextPerson} />
        }
      </main>
    </div>
  )
}