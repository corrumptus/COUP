import { Server, Socket } from "socket.io";
import { Server as HTTPServer} from "http";
import GameService from "../service/GameService";
import LobbyService from "../service/LobbyService";
import PlayerService from "../service/PlayerService";
import CardType from "../entity/CardType";
import { LobbyState } from "../service/LobbyMessageService";
import { GameState, PlayerState } from "../service/GameMessageService";
import SocketValidatorService from "../service/SocketValidatorService";

interface RequestSocketOnEvents {
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
    "taxar": (card: CardType, selfCard: number) => void;
    "corrupcao": (card: CardType, selfCard: number) => void;

    "extorquir": (card: CardType, selfCard: number, target: string) => void;

    "assassinar": (card: CardType, selfCard: number, target: string, targetCard: number) => void;
    "investigar": (card: CardType, selfCard: number, target: string, targetCard: number) => void;
    "golpeEstado": (target: string, targetCard: number) => void;

    "trocarReligiaoOutro": (target: string) => void;
    "trocarPropriaReligiao": () => void;

    "trocar": (card: CardType, selfCard: number, target: string, targetCard: number) => void;

    "contestar": (selfCard?: number) => void;
    "bloquear": (card?: CardType, selfCard?: number) => void;
    "continuar": () => void;
}

export interface ResponseSocketEmitEvents {
    "disconnectReason": (reason: string) => void;

    "playerConnected": (lobbyState: LobbyState) => void;
    "configsUpdated": (keys: string[], value: number | boolean) => void;
    "passwordUpdated": (password?: string) => void;
    "newPlayer": (player: string) => void;
    "leavingPlayer": (player: string) => void;
    "newOwner": (name: string) => void;
    "beginMatch": (gameState: GameState, sessionCode: string) => void;

    "updatePlayer": (updates: GameState) => void;
    "addPlayer": (player: Omit<PlayerState, "state">) => void;
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

export type COUPSocket = Socket<RequestSocketOnEvents, ResponseSocketEmitEvents>;

export default function initSocket(server: HTTPServer) {
    const serverSocket: Server = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    serverSocket.on("connection", async (socket: COUPSocket) => {
        const error = SocketValidatorService.validate(socket);

        if (error !== undefined) {
            socket.emit("disconnectReason", error);
            socket.disconnect();
            return;
        }

        await PlayerService.setListeners(socket);

        LobbyService.setListeners(socket);

        GameService.setListeners(socket);
    });
}