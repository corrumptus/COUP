import type { Socket } from "socket.io-client";
import type LobbyState from "@type/lobby";
import type { Card, EnemyPlayer, GameState } from "@type/game";

export type ResponseSocketEmitEvents = {
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

    "trocar": (card: Card, selfCard: number, target: string, targetCard?: number) => void;

    "contestar": (selfCard?: number) => void;
    "bloquear": (card: Card, selfCard?: number) => void;
    "continuar": () => void;

    "finishMatch": () => void;
    "restartMatch": () => void;
}

export type RequestSocketOnEvents = {
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
    "addPlayer": (player: EnemyPlayer) => void;
    "gameActionError": (message: string) => void;
}

export type COUPSocket = Socket<RequestSocketOnEvents, ResponseSocketEmitEvents>;