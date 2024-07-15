import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameMobileView from "@pages/GameMobileView";
import GamePCView from "@pages/GamePCView";
import { COUPSocket, Config } from "@utils/socketAPI";
import { useDeviceWidth } from "@utils/utils";
import useUIChanger from "@utils/UIChanger";

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
    investigatedCard: Card
  } | {
    type: ContextType.BEING_ATTACKED,
    attacker: string,
    action: Action,
    card: Card,
    attackedCard?: number
  } | {
    type: ContextType.OBSERVING,
    attacker: string,
    action?: Action,
    card?: Card,
    target?: string,
    attackedCard?: number
  }
}

export default function GameView({
  gameState,
  socket
}: {
  gameState: GameState,
  socket: COUPSocket
}) {
  const [ menuType, requeriments, changeUI ] = useUIChanger();
  const [ isDiffsVisible, setIsDiffsVisible ] = useState(true);
  const width = useDeviceWidth();
  const router = useRouter();

  useEffect(() => {
    if (gameState.context !== undefined)
      changeUI(gameState, requeriments);
  });

  function leave() {
    socket.disconnect();
    router.push("/");
  }

  return width < 800 ?
    <GameMobileView
      isDiffsVisible={isDiffsVisible}
      closeDiffs={() => setIsDiffsVisible(false)}
      gameState={gameState}
      menuType={menuType}
      requeriments={requeriments}
      performChange={changeRequest => changeUI(gameState, changeRequest)}
      leave={leave}
    />
    :
    <GamePCView
      isDiffsVisible={isDiffsVisible}
      closeDiffs={() => setIsDiffsVisible(false)}
      gameState={gameState}
      menuType={menuType}
      requeriments={requeriments}
      performChange={changeRequest => changeUI(gameState, changeRequest)}
      leave={leave}
    />
}