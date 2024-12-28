import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GameMobileView from "@pages/GameMobileView";
import GamePCView from "@pages/GamePCView";
import useDeviceWidth from "@hooks/useDeviceWidth";
import useUIChanger from "@hooks/useUIChanger";
import type { COUPSocket } from "@type/socket";
import { GameState } from "@type/game";

export default function GameView({
  socket,
  gameState
}: {
  socket: COUPSocket,
  gameState: GameState
}) {
  const [ menuType, requeriments, changeUI ] = useUIChanger();
  const [ isDiffsVisible, setIsDiffsVisible ] = useState(true);
  const [ isNextPersonVisible, setIsNextPersonVisible ] = useState(false);
  const width = useDeviceWidth();
  const router = useRouter();

  useEffect(() => {
    if (width !== 0)
      changeUI(socket, gameState, {});
  }, [width, JSON.stringify(gameState.context)]);

  useEffect(() => {
    if (!isDiffsVisible)
      setIsNextPersonVisible(true);
  }, [isDiffsVisible, gameState.game.currentPlayer]);

  function leave() {
    socket.disconnect();
    localStorage.removeItem("coup-sessionCode");
    router.push("/");
  }

  function goToOtherView() {
    socket.emit("finishMatch");
  }

  function restartMatch() {
    socket.emit("restartMatch");
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
      goToLobbyView={goToOtherView}
      restartMatch={restartMatch}
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
      goToLobbyView={goToOtherView}
      restartMatch={restartMatch}
    />
}