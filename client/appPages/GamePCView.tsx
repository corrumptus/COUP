import ConfigDiff from "@components/game/ConfigDiff";
import GameActionMenu from "@components/game/GameActionMenu";
import GamePcFooter from "@components/game/GamePcFooter";
import Header from "@components/game/Header";
import NextPerson from "@components/game/NextPerson";
import Players from "@components/game/Players";
import ReligionButton from "@components/game/ReligionIcon";
import { configDiff } from "@utils/utils";
import Toasters from "@utils/Toasters";
import { Action, GameState } from "@type/game";
import {
  ActionRequeriments,
  ChangeRequest,
  MenuTypes
} from "@type/gameUI";
import WinnerView from "@components/game/WinnerView";
import { GameCardVersions } from "@hooks/useCardVersions";

export default function GamePCView({
  isDiffsVisible,
  closeDiffs,
  isNextPersonVisible,
  closeNextPerson,
  gameState,
  gameCardVersions,
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
  gameCardVersions: GameCardVersions,
  menuType: MenuTypes,
  requeriments: ActionRequeriments,
  performChange: (changeRequest: ChangeRequest) => void,
  leave: () => void,
  goToLobbyView: () => void,
  restartMatch: () => void
}) {
  return (
    <div
      className="w-full h-full flex flex-col"
      id="gameView"
      data-testid="gameView"
    >
      <Header leave={leave} />
      <main className="h-full flex flex-col relative overflow-hidden bg-[url(../public/game-page.png)] bg-cover bg-bottom">
        {gameState.player.religion !== undefined &&
          <button
            id="gameView-playerReligionButton"
            data-testid="gameView-playerReligionButton"
            onClick={() => performChange({ action: Action.TROCAR_PROPRIA_RELIGIAO })}
          >
            <ReligionButton
              religion={gameState.player.religion}
              className="absolute top-0 left-0 cursor-pointer hover:scale-110"
            />
          </button>
        }
        <Players
          players={gameState.game.players}
          playersCardVersions={gameCardVersions.gamePlayers}
          performChange={performChange}
        />
        <GamePcFooter
          player={gameState.player}
          playerCardVersions={gameCardVersions.player}
          performChange={performChange}
          configs={gameState.game.configs}
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
            gameCardVersions={gameCardVersions}
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