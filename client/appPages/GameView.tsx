import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GameMobileView from "@pages/GameMobileView";
import GamePCView from "@pages/GamePCView";
import { useDeviceWidth } from "@utils/utils";
import useUIChanger from "@utils/UIChanger";
import { newToaster } from "@utils/Toasters";
import type { COUPSocket } from "@type/socket";
import { ContextType, type EnemyPlayer, type GameState } from "@type/game";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";

export default function GameView({
  goToLobbyView,
  socket
}: {
  goToLobbyView: () => void,
  socket: COUPSocket
}) {
  const [ gameState, setGameState ] = useState<GameState>({
    player: {
      cards: [],
      money: 0,
      name: "PlayerName",
      religion: undefined
    },
    game: {
      asylum: 0,
      configs: COUPDefaultConfigs,
      currentPlayer: "CurrentPlayer",
      players: [],
      winner: undefined
    },
    context: {
      type: ContextType.OBSERVING,
      attacker: "attacker",
      isInvestigating: false,
      winContesting: false
    }
  });
  const [ menuType, requeriments, changeUI ] = useUIChanger();
  const [ isDiffsVisible, setIsDiffsVisible ] = useState(true);
  const [ isNextPersonVisible, setIsNextPersonVisible ] = useState(false);
  const width = useDeviceWidth();
  const router = useRouter();

  useEffect(() => {
    socket.on("beginMatch", (gameState: GameState, sessionCode: string) => {
      setGameState(gameState);
      localStorage.setItem("coup-sessionCode", sessionCode);
    });

    socket.on("gameActionError", (message: string) => {
      newToaster(message);
    });

    socket.on("updatePlayer", (newGameState: GameState) => {
      setGameState(newGameState);
    });

    socket.on("addPlayer", (player: EnemyPlayer) => {
      setGameState(prevGameState => {
        const newGameState: GameState = JSON.parse(JSON.stringify(prevGameState));

        newGameState.game.players.push(player);

        return newGameState;
      });
    });

    socket.on("leavingPlayer", (player: string) => {
      setGameState(prevGameState => {
        const newGameState: GameState = JSON.parse(JSON.stringify(prevGameState));

        const index = newGameState.game.players.findIndex(p => p.name === player);

        if (index === -1)
          return prevGameState;

        newGameState.game.players.splice(index, 1);

        return newGameState;
      });
    });

    socket.emit("canReceive");

    return () => {
      socket.emit("cantReceive");

      socket.removeAllListeners("beginMatch");
      socket.removeAllListeners("gameActionError");
      socket.removeAllListeners("updatePlayer");
      socket.removeAllListeners("addPlayer");
      socket.removeAllListeners("leavingPlayer");
    };
  }, []);

  useEffect(() => {
    changeUI(socket, gameState, {});
  }, [JSON.stringify(gameState.context)]);

  useEffect(() => {
    if (!isDiffsVisible)
      setIsNextPersonVisible(true);
  }, [isDiffsVisible, gameState.game.currentPlayer]);

  function leave() {
    socket.disconnect();
    localStorage.removeItem("coup-sessionCode");
    router.push("/");
  }

  return width < 800 ?
    <GameMobileView
      isDiffsVisible={isDiffsVisible}
      closeDiffs={() => setIsDiffsVisible(false)}
      isNextPersonVisible={isNextPersonVisible}
      closeNextPerson={() => setIsNextPersonVisible(false)}
      gameState={gameState}
      menuType={menuType}
      requeriments={requeriments}
      performChange={changeRequest => changeUI(socket, gameState, changeRequest)}
      leave={leave}
    />
    :
    <GamePCView
      isDiffsVisible={isDiffsVisible}
      closeDiffs={() => setIsDiffsVisible(false)}
      isNextPersonVisible={isNextPersonVisible}
      closeNextPerson={() => setIsNextPersonVisible(false)}
      gameState={gameState}
      menuType={menuType}
      requeriments={requeriments}
      performChange={changeRequest => changeUI(socket, gameState, changeRequest)}
      leave={leave}
    />
}