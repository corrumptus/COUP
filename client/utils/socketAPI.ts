import { Socket, io } from "socket.io-client"
import { LobbyState } from "@pages/LobbyView";
import { Card, GameState } from "@pages/GameView";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";
import { Differ, objectDiff } from "./utils";
import { useEffect, useState } from "react";

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
  "enterLobby": (lobbyID: number) => void;

  "updateConfigs": (keys: string[], value: number | boolean) => void;
  "newOwner": (name: string) => void;
  "removePlayer": (name: string) => void;
  "beginMatch": (customConfigs?: Config) => void;

  "renda": () => void;
  "ajudaExterna": () => void;
  "taxar": (card: Card) => void;

  "extorquir": (card: Card, targetName: string) => void;

  "assassinar": (card: Card, targetName: string, playerCard: number) => void;
  "investigar": (card: Card, targetName: string, playerCard: number) => void;
  "golpeEstado": (targetName: string, playerCard: number) => void;

  "trocarReligiaoOutro": (targetName: string) => void;
  "trocarReligiaoPropria": () => void;

  "trocar": (card: Card, targetName?: string, playerCard?: number) => void;
  "manter": () => void;

  "contestar": (targetName: string) => void;
  "bloquear": (card: Card, targetName: string) => void;
  "aceitar": () => void;
}

type RequestSocketOnEvents = {
  "playerConnected": (gameState: LobbyState) => void;
  "configsUpdate": (keys: string[], value: number | boolean) => void;
  "newPlayer": (player: string) => void;
  "leavingPlayer": (index: number) => void;
  "gameInit": (gameState: GameState) => void;
}

export type COUPSocket = Socket<RequestSocketOnEvents, ResponseSocketEmitEvents>;

export function useSocket(url: string) {
  const [ socket, setSocket ] = useState<COUPSocket>();

  useEffect(() => {
    setSocket(io(url, {
      auth: {
        token: localStorage.getItem("coup-token")
      }
    }));

    return () => {(socket as COUPSocket).disconnect()};
  }, []);

  return socket as COUPSocket;
}

export function configDiff(configs: Config): Partial<Differ<Config>> {
  return objectDiff(COUPDefaultConfigs, configs);
}

export const DEFAULT_SOCKET_URL = "http://localhost:5000";