import { useState } from "react";
import ReligionIcon from "@components/game/ReligionIcon";
import PlayersTutorial from "@components/tutorial/gameView/PlayersTutorial";
import FooterTutorial from "@components/tutorial/gameView/FooterTutorial";
import ConfigDiffTutorial from "@components/tutorial/gameView/ConfigDiffTutorial";
import NextPersonTutorial from "@components/tutorial/gameView/NextPersonTutorial";
import ActionMenuTutorial from "@components/tutorial/gameView/ActionMenuTutorial";
import { configDiff, PlayerCardColor } from "@utils/utils";
import Toasters from "@utils/Toasters";
import { GameState } from "@type/game";
import { ActionRequeriments, CardVersion, MenuTypes } from "@type/gameUI";

export default function GameViewTutorial({
  isDiffsVisible,
  isNextPersonVisible,
  gameState,
  requeriments,
  colors,
  cardVersions
}: {
  isDiffsVisible: boolean,
  isNextPersonVisible: boolean,
  gameState: GameState,
  requeriments: ActionRequeriments,
  colors: PlayerCardColor
  cardVersions: {
    player: { first: CardVersion, second: CardVersion },
    players: { first: CardVersion, second: CardVersion }[]
  }
}) {
  const [ menuType ] = useState(MenuTypes.CLOSED);

  return (
    <div className="w-full flex flex-col font-sans">
      <main className="flex flex-col relative overflow-hidden bg-[url(../public/game-page.png)] bg-cover bg-bottom">
        {gameState.player.religion !== undefined &&
          <button className="border-2 border-black absolute top-0 left-0 hover:scale-110 rounded-full m-1 overflow-hidden">
            <ReligionIcon religion={gameState.player.religion} />
          </button>
        }
        <PlayersTutorial
          players={gameState.game.players}
          colors={colors}
          versions={cardVersions.players}
        />
        <FooterTutorial
          player={gameState.player}
          configs={gameState.game.configs}
          cardVersions={cardVersions.player}
        />
        {isDiffsVisible &&
          <ConfigDiffTutorial configDiff={configDiff(gameState.game.configs)} />
        }
        {isNextPersonVisible &&
          <NextPersonTutorial person={gameState.game.currentPlayer} />
        }
        <Toasters />
        {menuType !== MenuTypes.CLOSED &&
          <ActionMenuTutorial
            type={menuType}
            gameState={gameState}
            requeriments={requeriments}
          />
        }
      </main>
    </div>
  )
}