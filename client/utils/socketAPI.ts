import { useEffect, useState } from "react";
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
  "enterLobby": (lobbyId: number) => void;

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

  "contestar": (selfCard?: number) => void;
  "bloquear": (card?: Card, selfCard?: number) => void;
  "continuar": () => void;
}

type RequestSocketOnEvents = {
  "playerConnected": (gameState: LobbyState) => void;
  "configsUpdated": (keys: string[], value: number | boolean) => void;
  "newPlayer": (player: string) => void;
  "leavingPlayer": (index: number) => void;
  "gameInit": (gameState: GameState) => void;
  "disconnectReason": (reason: string) => void;
}

export type COUPSocket = Socket<RequestSocketOnEvents, ResponseSocketEmitEvents>;

let socket: COUPSocket;

export function useSocket() {
  const [ error, setError ] = useState<string>();

  if (
    localStorage.getItem("coup-token") === null
    &&
    sessionStorage.getItem("coup-name") === null
  )
    return { error: "O usuário deve estar logado ou possuir um nome" };

  if (error !== undefined)
    return { error: error };

  if (socket !== undefined)
    return { socket: socket };

  socket = (io("http://localhost:5000", {
    auth: localStorage.getItem("coup-token") !== null ?
      {
        token: localStorage.getItem("coup-token")
      }
      :
      {
        name: sessionStorage.getItem("coup-name")
      }
  }) as COUPSocket)
    .on("disconnectReason", (reason) => {
      setError(reason);
    }).on("disconnect", () => {
      setError(err => err === undefined ? "Não foi possível se conectar ao servidor" : err);
    });

  return { socket: socket };
}

export function configDiff(configs: Config): Differ<Config> {
  return objectDiff(COUPDefaultConfigs, configs);
}