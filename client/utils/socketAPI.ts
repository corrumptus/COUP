import { Socket, io } from "socket.io-client"
import { LobbyState } from "@pages/LobbyView";
import { Card, GameState } from "@pages/GameView";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";
import { Differ, objectDiff } from "@utils/utils";

type Carta = {
  taxar: boolean,
  extorquir: boolean,
  assassinar: boolean,
  trocar: boolean,
  investigar: boolean,
  quantidadeTaxar: number,
  quantidadeExtorquir: number,
  quantidadeAssassinar: number,
  quantidadeTrocar: number,
  quantidadeInvestigar: number,
  bloquearTaxar: boolean,
  bloquearExtorquir: boolean,
  bloquearAssassinar: boolean,
  bloquearTrocar: boolean,
  bloquearInvestigar: boolean
}

export type Config = {
  moedasIniciais: number,
  renda: number,
  ajudaExterna: number,
  quantidadeMinimaGolpeEstado: number,
  quantidadeMaximaGolpeEstado: number,
  religiao: {
    reforma: boolean,
    quantidadeTrocarPropria: number,
    quantidadeTrocarOutro: number,
    deveres: {
      golpeEstado: boolean,
      assassinar: boolean,
      extorquir: boolean,
      taxar: boolean
    },
    cartasParaCorrupcao: {
      duque: boolean,
      capitao: boolean,
      assassino: boolean,
      condessa: boolean,
      embaixador: boolean,
      inquisidor: boolean
    }
  },
  tiposCartas: {
    duque: Carta,
    capitao: Carta,
    assassino: Carta,
    condessa: Carta,
    embaixador: Carta,
    inquisidor: Carta
  }
}

type ResponseSocketEmitEvents = {
  "enterLobby": (lobbyID: number) => void;

  "updateConfigs": (keys: string[], value: number | boolean) => void;
  "newOwner": (name: string) => void;
  "removePlayer": (name: string) => void;
  "beginMatch": () => void;

  "renda": () => void;
  "ajudaExterna": () => void;
  "taxar": (card: Card, selfCard: number) => void;
  "corrupcao": (card: Card, selfCard: number) => void;

  "extorquir": (card: Card, selfCard: number, target: string) => void;

  "assassinar": (card: Card, selfCard: number, target: string, targetCard: number) => void;
  "investigar": (card: Card, selfCard: number, target: string, targetCard: number) => void;
  "golpeEstado": (target: string, targetCard: number) => void;

  "trocarReligiaoOutro": (target: string) => void;
  "trocarPropriaReligiao": () => void;

  "trocar": (card: Card, selfCard: number, target: string, targetCard: number) => void;
  
  "contestar": (card?: Card, selfCard?: number) => void;
  "bloquear": (card?: Card, selfCard?: number) => void;
  "continuar": () => void;
}

type RequestSocketOnEvents = {
  "playerConnected": (gameState: LobbyState) => void;
  "configsUpdated": (keys: string[], value: number | boolean) => void;
  "newPlayer": (player: string) => void;
  "leavingPlayer": (index: number) => void;
  "gameInit": (gameState: GameState) => void;
}

export type COUPSocket = Socket<RequestSocketOnEvents, ResponseSocketEmitEvents>;

async function getURL(lobbyID: number): Promise<string | undefined> {
  if (typeof localStorage === undefined)
    return "";

  try {
    const response = await fetch("http://localhost:5000/lobby/" + lobbyID.toString(), {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("coup-token") as string
      }
    });

    const result = await response.json();
  
    if (!response.ok)
      throw new Error((result as { error: string }).error);
  
    return (result as { url: string }).url;
  } catch (error) {
    return undefined;
  }
}

let socket: COUPSocket;

export async function enterLobby(lobbyID: number) {
  if (socket !== undefined)
    return { socket: socket };

  const url = await getURL(lobbyID);

  if (url === undefined)
    return { error: "Cannot access the server" };

  socket = io(url, {
    auth: {
      token: localStorage.getItem("coup-token")
    }
  });

  return { socket: socket };
}

export function configDiff(configs: Config): Differ<Config> {
  return objectDiff(COUPDefaultConfigs, configs);
}