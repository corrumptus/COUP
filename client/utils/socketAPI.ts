import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client"
import { LobbyState } from "@pages/LobbyView";
import { Card, GameState, Player } from "@pages/GameView";
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
  "canReceive": () => void;
  "cantReceive": () => void;

  "updateConfigs": (keys: string[], value: number | boolean) => void;
  "newOwner": (name: string) => void;
  "removePlayer": (name: string) => void;
  "changePassword": (password: string) => void;
  "removePassword": () => void;
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
  "disconnectReason": (reason: string) => void;

  "playerConnected": (lobbyState: LobbyState) => void;
  "configsUpdated": (keys: string[], value: number | boolean) => void;
  "passwordUpdated": (password: string | undefined) => void;
  "newPlayer": (player: string) => void;
  "leavingPlayer": (player: string) => void;
  "newOwner": (name: string) => void;
  "reconnectingLobby": (id: number) => void;
  "beginMatch": (gameState: GameState, sessionCode: string) => void;

  "updatePlayer": (updates: GameState) => void;
  "addPlayer": (player: Omit<Player, "state">) => void;
  "gameActionError": (message: string) => void;
}

export type COUPSocket = Socket<RequestSocketOnEvents, ResponseSocketEmitEvents>;

export default function useSocket(id?: string) {
  const [ error, setError ] = useState<string | undefined>("page not initialized");
  const socketRef = useRef<COUPSocket | undefined>(undefined);

  useEffect(() => {
    function onUnload() {
      socketRef.current = undefined;
    }

    window.addEventListener("unload", onUnload);

    return () => {
      window.removeEventListener("unload", onUnload);
    }
  }, []);

  useEffect(() => {
    console.log(error);

    if (socketRef.current !== undefined)
      return;

    if (
      localStorage.getItem("coup-token") === null
      &&
      sessionStorage.getItem("coup-name") === null
      &&
      localStorage.getItem("coup-sessionCode") === null
    ) {
      setError("O usuário deve estar logado ou possuir um nome");
      return;
    }

    if (
      id !== undefined
      &&
      Number.isNaN(Number(id))
    ) {
      setError("Lobby inválido");
      return;
    }

    const lobby = id === undefined ? undefined : Number(id);

    let auth;

    if (localStorage.getItem("coup-sessionCode") !== null)
      auth = {
        sessionCode: localStorage.getItem("coup-sessionCode")
      }
    else if (localStorage.getItem("coup-token") !== null)
      auth = {
        token: localStorage.getItem("coup-token"),
        lobby: lobby
      }
    else
      auth = {
        name: sessionStorage.getItem("coup-name"),
        lobby: lobby
      }

    socketRef.current = 
      (io("http://localhost:5000", {
        auth: auth
      }) as COUPSocket)
        .on("disconnectReason", (reason) => {
          setError(reason);
        })
        .on("disconnect", () => {
          localStorage.removeItem("coup-sessionCode");
          setError(err => err === undefined ? "Não foi possível se conectar ao servidor" : err);
        });

    setError(undefined);
  }, []);

  if (error !== undefined)
    return { error: error };

  return { socket: socketRef.current as COUPSocket };
}

export function configDiff(configs: Config): Differ<Config> {
  return objectDiff(COUPDefaultConfigs, configs);
}