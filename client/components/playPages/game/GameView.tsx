import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameMobileView from "@pages/GameMobileView";
import GamePCView from "@pages/GamePCView";
import { COUPSocket, Config } from "@utils/socketAPI";
import { useDeviceWidth } from "@utils/utils";
import useUIChanger from "@utils/UIChanger";
import { newToaster } from "@utils/Toasters";

export enum Religion {
  PROTESTANTE = "PROTESTANTE",
  CATOLICA = "CATOLICA"
}

export enum Card {
  DUQUE = "duque",
  CAPITAO = "capitao",
  ASSASSINO = "assassino",
  CONDESSA = "condessa",
  EMBAIXADOR = "embaixador",
  INQUISIDOR = "inquisidor"
}

export enum Action {
  RENDA = "renda",
  AJUDA_EXTERNA = "ajudaExterna",
  GOLPE_ESTADO = "golpeEstado",
  TAXAR = "taxar",
  ASSASSINAR = "assassinar",
  EXTORQUIR = "extorquir",
  TROCAR = "trocar",
  INVESTIGAR = "investigar",
  TROCAR_PROPRIA_RELIGIAO = "trocarPropriaReligiao",
  TROCAR_RELIGIAO_OUTRO = "trocarReligiaoOutro",
  CORRUPCAO = "corrupcao",
  CONTESTAR = "contestar",
  BLOQUEAR = "bloquear",
  CONTINUAR = "continuar"
}

export enum PlayerState {
  WAITING_TURN = "waitingTurn",
  THINKING = "thinking",
  WAITING_REPLY = "waitingReply",
  BEING_ATTACKED = "beingAttacked",
  INVESTIGATING = "investigating",
  BEING_BLOCKED = "beingBlocked",
  NEED_TO_GOLPE_ESTADO = "needToGolpeEstado"
}

export type Player = {
  name: string,
  cards: { card: Card | undefined, isDead: boolean }[],
  money: number,
  religion?: Religion,
  state: PlayerState
}

export enum ContextType {
  INVESTIGATING,
  BEING_ATTACKED,
  OBSERVING
}

export type GameState = {
  player: Player,
  game: {
    players: Omit<Player, "state">[],
    currentPlayer: string,
    asylum: number,
    configs: Config
  },
  context: {
    type: ContextType.INVESTIGATING,
    card: Card,
    target: string,
    investigatedCard: Card,
    targetCard: number
  } | {
    type: ContextType.BEING_ATTACKED,
    attacker: string,
    action: Action,
    card: Card,
    attackedCard?: number,
    previousAction?: Action,
    preBlockAction?: Action
  } | {
    type: ContextType.OBSERVING,
    attacker: string,
    action?: Action,
    card?: Card,
    target?: string,
    attackedCard?: number,
    isInvestigating: boolean
  }
}

export default function GameView({
  gameState,
  socket,
  changeGameState
}: {
  gameState: GameState,
  socket: COUPSocket,
  changeGameState: (gameState: GameState) => void
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

    socket.on("addPlayer", (player: Omit<Player, "state">) => {
      const newGameState: GameState = JSON.parse(JSON.stringify(gameState));

      newGameState.game.players.push(player);

      changeGameState(newGameState);
    });

    socket.on("leavingPlayer", (player: string) => {
      const newGameState: GameState = JSON.parse(JSON.stringify(gameState));

      const index = newGameState.game.players.findIndex(p => p.name === player);

      if (index === -1)
        return;

      newGameState.game.players.splice(index, 1);

      changeGameState(newGameState);
    });
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