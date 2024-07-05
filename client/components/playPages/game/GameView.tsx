import { useState } from "react";
import GameMobileView from "@pages/GameMobileView";
import GamePCView from "@pages/GamePCView";
import { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";
import { COUPSocket, Config } from "@utils/socketAPI";
import { menuTypeFrom, useDeviceWidth } from "@utils/utils";

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
  INVESTIGAR = "inventigar",
  TROCAR_PROPRIA_RELIGIAO = "trocarPropriaReligiao",
  TROCAR_RELIGIAO_OUTRO = "trocarReligiaoOutro",
  CORRUPCAO = "corrupcao",
  CONTESTAR = "contestar",
  BLOQUEAR = "bloquear"
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

export type GameState = {
  player: Player,
  game: {
    players: Player[],
    currentPlayer: string,
    asylum: number,
    configs: Config
  }
}

export default function GameView({
  gameState,
  socket
}: {
  gameState: GameState,
  socket: COUPSocket
}) {
  const initialMenuType = menuTypeFrom(gameState.player.state);
  const [ menuType, setMenuType ] = useState<MenuTypes | undefined>(initialMenuType);
  const [ requeriments, setRequeriments ] = useState<ActionRequeriments>({});
  const [ isDiffsVisible, setIsDiffsVisible ] = useState(true);
  const width = useDeviceWidth();

  function changeMenuType(menuType: MenuTypes | undefined) {
    if (gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado)
      return;

    if (initialMenuType !== undefined)
      return;

    setMenuType(menuType);
  }

  function addRequeriment<K extends keyof ActionRequeriments>(
    requerimentType: K,
    requeriment: ActionRequeriments[K]
  ) {
    setRequeriments(prev => ({ ...prev, [requerimentType]: requeriment }));
  }

  return width < 800 ?
    <GameMobileView
      isDiffsVisible={isDiffsVisible}
      closeDiffs={() => setIsDiffsVisible(false)}
      gameState={gameState}
      menuType={menuType}
      changeMenuType={changeMenuType}
      requeriments={requeriments}
      addRequeriment={addRequeriment}
      socket={socket}
    />
    :
    <GamePCView
      isDiffsVisible={isDiffsVisible}
      closeDiffs={() => setIsDiffsVisible(false)}
      gameState={gameState}
      menuType={menuType}
      changeMenuType={changeMenuType}
      requeriments={requeriments}
      addRequeriment={addRequeriment}
      socket={socket}
    />
}