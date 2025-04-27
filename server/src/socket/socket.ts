import type { Server as HTTPServer} from "http";
import { Server, Socket } from "socket.io";
import type { GameState, EnemyPlayer } from "@services/GameMessageService";
import SocketConnectionService from "@services/SocketConnectionService";
import type CardType from "@entitys/CardType";
import Player from "@entitys/player";
import Lobby from "@entitys/Lobby";
import type { LobbyState } from "@utils/LobbyStateCalculator";

export interface RequestSocketOnEvents {
    "canReceive": () => void;
    "cantReceive": () => void;

    "updateConfigs": (keys: string[], value: number | boolean) => void;
    "newOwner": (player: string) => void;
    "removePlayer": (player: string) => void;
    "changePassword": (password: string) => void;
    "removePassword": () => void;
    "beginMatch": () => void;

    "renda": () => void;
    "ajudaExterna": () => void;
    "taxar": (card: CardType, selfCard: number) => void;
    "corrupcao": (card: CardType, selfCard: number) => void;

    "extorquir": (card: CardType, selfCard: number, target: string) => void;

    "assassinar": (card: CardType, selfCard: number, target: string, targetCard: number) => void;
    "investigar": (card: CardType, selfCard: number, target: string, targetCard: number) => void;
    "golpeEstado": (target: string, targetCard: number) => void;

    "trocar": (card: CardType, selfCard: number, target: string, targetCard?: number) => void;

    "trocarReligiaoOutro": (target: string) => void;
    "trocarPropriaReligiao": () => void;

    "bloquear": (card: CardType, selfCard?: number) => void;
    "contestar": (selfCard?: number) => void;
    "continuar": () => void;

    "finishMatch": () => void;
    "restartMatch": () => void;
}

export interface ResponseSocketEmitEvents {
    "disconnectReason": (reason: string) => void;

    "playerConnected": (lobbyState: LobbyState) => void;
    "configsUpdated": (keys: string[], value: number | boolean) => void;
    "passwordUpdated": (password?: string) => void;
    "newPlayer": (player: string) => void;
    "leavingPlayer": (player: string) => void;
    "newOwner": (player: string) => void;
    "reconnectingLobby": (id: Lobby["id"]) => void;
    "beginMatch": (gameState: GameState) => void;
    "reconnectionCode": (code: number) => void;

    "updatePlayer": (updates: GameState) => void;
    "addPlayer": (player: EnemyPlayer) => void;
    "gameActionError": (message: string) => void;
}

export type SocketEmitLobbyEvents =
    "playerConnected" |
    "configsUpdated" |
    "passwordUpdated" |
    "newPlayer" |
    "leavingPlayer" |
    "newOwner" |
    "beginMatch";

export type SocketData = {
    player: Player,
    canReceive: boolean,
    lobbyId: Lobby["id"],
    reconnectionCode: number
}

export type COUPSocket = Socket<RequestSocketOnEvents, ResponseSocketEmitEvents, {}, SocketData>;

export default function initSocket(server: HTTPServer) {
    const serverSocket: Server = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    serverSocket.on("connection", SocketConnectionService.connectSocket);
}