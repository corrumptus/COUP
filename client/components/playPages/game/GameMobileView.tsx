import { useState } from "react";
import Image from "next/image";
import { GameState } from "@pages/GameView";
import ConfigDiff from "@components/ConfigDiff";
import GameActionMenu, { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";
import GameMobileMenu from "@components/GameMobileMenu";
import Players from "@components/Players";
import { configDiff } from "@utils/socketAPI";
import Toasters from "@utils/Toasters";
import { ChangeRequest } from "@utils/UIChanger";

export default function GameMobileView({
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
  requeriments: ActionRequeriments,
  performChange: (changeRequest: ChangeRequest) => void,
  leave: () => void
}) {
  const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false);

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
        <Image
          src="/menu-hamburguer-icon.png"
          alt="menu hamburguer"
          className=""
          onClick={() => setIsMobileMenuOpen(is => !is)}
          width={40}
          height={40}
        />
      </header>
      <main className="h-full flex flex-col relative overflow-hidden bg-[url(../public/game-page.png)] bg-cover bg-bottom">
        <Toasters />
        {isDiffsVisible &&
          <ConfigDiff
            configDiff={configDiff(gameState.game.configs)}
            disappear={closeDiffs}
          />
        }
        <GameMobileMenu
          player={gameState.player}
          performChange={performChange}
          configs={gameState.game.configs}
          isOpen={isMobileMenuOpen}
        />
        <Players
          players={gameState.game.players}
          performChange={performChange}
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