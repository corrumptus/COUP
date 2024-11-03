import Image from "next/image";
import { useState } from "react";
import ConfigDiff from "@components/game/ConfigDiff";
import GameActionMenu from "@components/game/GameActionMenu";
import GameMobileMenu from "@components/game/GameMobileMenu";
import Header from "@components/game/Header";
import NextPerson from "@components/game/NextPerson";
import Players from "@components/game/Players";
import { configDiff } from "@utils/socketAPI";
import Toasters from "@utils/Toasters";
import { GameState } from "@type/game";
import {
  ActionRequeriments,
  ChangeRequest,
  MenuTypes
} from "@type/gameUI";

export default function GameMobileView({
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
  requeriments: ActionRequeriments,
  performChange: (changeRequest: ChangeRequest) => void,
  leave: () => void
}) {
  const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false);

  return (
    <div className="w-full h-full flex flex-col">
      <Header
        leave={leave}
        children={
          <Image
            src="/menu-hamburguer-icon.png"
            alt="menu hamburguer"
            className=""
            onClick={() => setIsMobileMenuOpen(is => !is)}
            width={40}
            height={40}
          />
        }
      />
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
        {isNextPersonVisible &&
          <NextPerson person={gameState.game.currentPlayer} closeNextPerson={closeNextPerson} />
        }
      </main>
    </div>
  )
}