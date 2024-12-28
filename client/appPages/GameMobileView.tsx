import Image from "next/image";
import { useState } from "react";
import ConfigDiff from "@components/game/ConfigDiff";
import GameActionMenu from "@components/game/GameActionMenu";
import GameMobileMenu from "@components/game/GameMobileMenu";
import Header from "@components/game/Header";
import NextPerson from "@components/game/NextPerson";
import Players from "@components/game/Players";
import WinnerView from "@components/game/WinnerView";
import { configDiff } from "@utils/utils";
import Toasters from "@utils/Toasters";
import type { GameState } from "@type/game";
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
  leave,
  goToLobbyView,
  restartMatch
}: {
  isDiffsVisible: boolean,
  closeDiffs: () => void,
  isNextPersonVisible: boolean,
  closeNextPerson: () => void,
  gameState: GameState,
  menuType: MenuTypes,
  requeriments: ActionRequeriments,
  performChange: (changeRequest: ChangeRequest) => void,
  leave: () => void,
  goToLobbyView: () => void,
  restartMatch: () => void
}) {
  const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false);

  return (
    <div
      className="w-full h-full flex flex-col"
      id="gameView"
      data-testid="gameView"
    >
      <Header leave={leave}>
        <Image
          src="/menu-hamburguer-icon.png"
          alt="menu hamburguer"
          onClick={() => setIsMobileMenuOpen(is => !is)}
          width={40}
          height={40}
          id="gameView-mobileMenuIcon"
          data-testid="gameView-mobileMenuIcon"
        />
      </Header>
      <main className="h-full flex flex-col relative overflow-hidden bg-[url(../public/game-page.png)] bg-cover bg-bottom">
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
        {isDiffsVisible &&
          <ConfigDiff
            configDiff={configDiff(gameState.game.configs)}
            disappear={closeDiffs}
          />
        }
        {isNextPersonVisible &&
          <NextPerson person={gameState.game.currentPlayer} closeNextPerson={closeNextPerson} />
        }
        <Toasters />
        {menuType !== MenuTypes.CLOSED &&
          <GameActionMenu
            type={menuType}
            gameState={gameState}
            requeriments={requeriments}
            performChange={performChange}
          />
        }
        {gameState.game.winner !== undefined &&
          <WinnerView
            name={gameState.game.winner}
            isOwner={true}
            leave={leave}
            goToLobbyView={goToLobbyView}
            restartMatch={restartMatch}
          />
        }
      </main>
    </div>
  )
}