import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import GameMobileView from "@pages/GameMobileView";
import GamePCView from "@pages/GamePCView";
import { useDeviceWidth } from "@utils/utils";
import useUIChanger from "@utils/UIChanger";
import { newToaster } from "@utils/Toasters";
import { COUPSocket } from "@types/socket";
import { EnemyPlayer, GameState } from "@types/game";

export default function GameView({
  gameState,
  socket,
  changeGameState
}: {
  gameState: GameState,
  socket: COUPSocket,
  changeGameState: Dispatch<SetStateAction<GameState | undefined>>
}) {
  const [ menuType, requeriments, changeUI ] = useUIChanger();
  const [ isDiffsVisible, setIsDiffsVisible ] = useState(true);
  const [ isNextPersonVisible, setIsNextPersonVisible ] = useState(false);
  const width = useDeviceWidth();
  const router = useRouter();

  useEffect(() => {
    socket.on("gameActionError", (message: string) => {
      newToaster(message);
    });

    socket.on("updatePlayer", (newGameState: GameState) => {
      changeGameState(newGameState);
    });

    socket.on("addPlayer", (player: EnemyPlayer) => {
      changeGameState(prevGameState => {
        const newGameState: GameState = JSON.parse(JSON.stringify(prevGameState));

        newGameState.game.players.push(player);

        return newGameState;
      });
    });

    socket.on("leavingPlayer", (player: string) => {
      changeGameState(prevGameState => {
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