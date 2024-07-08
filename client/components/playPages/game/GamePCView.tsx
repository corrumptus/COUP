import Image from "next/image";
import { Action, GameState, Religion } from "@pages/GameView";
import ConfigDiff from "@components/ConfigDiff";
import GameActionMenu, { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";
import GamePcFooter from "@components/GamePcFooter";
import Players from "@components/Players";
import { configDiff } from "@utils/socketAPI";
import Toasters from "@utils/Toasters";
import { ChangeRequest } from "@utils/UIChanger";

export default function GamePCView({
  isDiffsVisible,
  closeDiffs,
  gameState,
  menuType,
  requeriments,
  performChange,
  leave
}: {
  isDiffsVisible: boolean,
  closeDiffs: () => void,
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
              onClick={() => performChange({
                action: Action.TROCAR_PROPRIA_RELIGIAO
              })}
              width={40}
              height={40}
            />
            :
            <Image
              src="/protestante-icon.png"
              alt="biblia"
              title="protestante"
              className="absolute top-0 left-0 cursor-pointer hover:scale-110"
              onClick={() => performChange({
                action: Action.TROCAR_PROPRIA_RELIGIAO
              })}
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
      </main>
    </div>
  )
}