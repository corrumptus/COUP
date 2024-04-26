import { Socket, io } from "socket.io-client"
import { LobbyState } from "../components/playPages/lobby/LobbyView";
import { Card, GameState } from "../components/playPages/game/GameView";
import COUPDefaultConfigs from "@/app/utils/COUPDefaultConfigs.json";

type Carta = {
  taxar: boolean,
  extorquir: boolean,
  assassinar: boolean,
  trocarPropria: boolean,
  trocarOutroJogador: boolean,
  investigar: boolean,
  quantidadeTaxar: number,
  quantidadeExtorquir: number,
  quantidadeAssassinar: number,
  quantidadeTrocarPropria: number,
  quantidadeTrocarOutroJogador: number,
  bloquearTaxar: boolean,
  bloquearExtorquir: boolean,
  bloquearAssassinar: boolean,
  bloquearTrocar: boolean,
  bloquearInvestigar: boolean
}

export type Config = {
  quantidadeMoedasIniciais: number,
  renda: number,
  ajudaExterna: number,
  quantidadeMinimaGolpeEstado: number,
  quantidadeMaximaGolpeEstado: number,
  religiao: boolean,
  quantidadeTrocarPropriaReligiao: number,
  quantidadeTrocarReligiaoOutroJogador: number,
  deveresMesmaReligiao: {
    golpeEstado: boolean,
    assassinar: boolean,
    extorquir: boolean,
    taxar: boolean
  },
  tiposCartas: {
    duque: Carta,
    capitao: Carta,
    assassino: Carta,
    condessa: Carta,
    embaixador: Carta,
    inquisidor: Carta
  }
};

type ResponseSocketEmitEvents = {
  "quit": () => void;
  "updateConfigs": (keys: string[], value: number | boolean) => void;
  "newOwner": (name: string) => void;
  "removePlayer": (name: string) => void;
  "beginMatch": () => void;

  "renda": () => void;
  "ajudaExterna": () => void;
  "taxar": (carta: Card) => void;

  "extorquir": (carta: Card, player: string) => void;

  "assassinar": (carta: Card, player: string, playerCard: number) => void;
  "investigar": (carta: Card, player: string, playerCard: number) => void;
  "golpeEstado": (player: string, playerCard: number) => void;

  "trocarReligiaoOutro": (player: string) => void;
  "trocarReligiaoPropria": () => void;

  "trocar": (carta: Card, player: string, playerCard?: number) => void;
  "manter": () => void;

  "contestar": () => void;
  "bloquear": () => void;
  "aceitar": () => void;
}

type RequestSocketOnEvents = {
  "playerConnected": (gameState: LobbyState) => void;
  "configsUpdate": (change: { keys: string[], value: any }) => void;
  "newPlayer": (player: string) => void;
  "leavingPlayer": (index: number) => void;
  "gameInit": (gameState: GameState) => void;
}

let socket!: Socket<RequestSocketOnEvents, ResponseSocketEmitEvents>;

export function initSocket(url: string) {
  if (socket !== undefined)
    return;

  socket = io(url, {
    auth: {
      token: localStorage.getItem("coup-token")
    }
  });
}

export type Differ<T> = {
  [ P in keyof T]: T[P] | T[P][]
}

export function configDiff(configs: Config): Partial<Differ<Config>> {
  return objectDiff(COUPDefaultConfigs, configs);
}

function objectDiff<T extends Record<string, any>>(base: T, differ: T): Partial<Differ<Config>> {
  const diff: Record<string, any> = {};

  for (let key in base) {
    if (typeof base[key] !== "object") {
      if (base[key] !== differ[key])
        diff[key] = [base[key], differ[key]];
    } else {
      let diffDeep = objectDiff(base[key], differ[key]);

      if (Object.keys(diffDeep).length !== 0)
        diff[key] = diffDeep;
    }
  }

  return diff;
}

export default socket;