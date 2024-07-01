import { useEffect, useState } from "react";
import GameMobileView from "@pages/GameMobileView";
import GamePCView from "@pages/GamePCView";
import { MenuTypes } from "@components/GameActionMenu";
import { COUPSocket, Config } from "@utils/socketAPI";
import { useDeviceWidth } from "@utils/utils";

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
  TROCAR_RELIGIAO = "trocarReligiao",
  CONTESTAR = "contestar",
  BLOQUEAR = "bloquear"
}

export type Player = {
  name: string;
  cards: { card: Card | undefined, isDead: boolean }[];
  money: number;
  religion?: Religion
}

export type GameState = {
  player: Player;
  game: {
    players: Player[];
    currentPlayer: string;
    configs: Config;
  }
}

export default function GameView({
  gameState,
  socket
}: {
  gameState: GameState,
  socket: COUPSocket
}) {
  const [ menuType, setMenuType ] = useState<MenuTypes | undefined>(undefined);
  const [ action, setAction ] = useState<Action | undefined>(undefined);
  const [ requeriments, setRequeriments ] = useState<{[key: string]: any}>({});
  const [ isDiffsVisible, setIsDiffsVisible ] = useState(true);
  const width = useDeviceWidth();

  useEffect(() => {
    if (gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado && menuType !== "othersCard")
      setMenuType(undefined)
  }, [menuType, action, requeriments]);

  return width < 800 ?
    <GameMobileView
      isDiffsVisible={isDiffsVisible}
      closeDiffs={() => setIsDiffsVisible(false)}
      gameState={gameState}
      action={action}
      changeAction={(action: Action | undefined) => setAction(action)}
      menuType={menuType}
      changeMenuType={(menuType: MenuTypes | undefined) => setMenuType(menuType)}
      requeriments={requeriments}
      setRequeriments={setRequeriments}
      socket={socket}
    />
    :
    <GamePCView
      isDiffsVisible={isDiffsVisible}
      closeDiffs={() => setIsDiffsVisible(false)}
      gameState={gameState}
      action={action}
      changeAction={(action: Action | undefined) => setAction(action)}
      menuType={menuType}
      changeMenuType={(menuType: MenuTypes | undefined) => setMenuType(menuType)}
      requeriments={requeriments}
      setRequeriments={setRequeriments}
      socket={socket}
    />
}