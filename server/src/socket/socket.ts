import { Server, Socket } from "socket.io";
import { Server as HTTPServer} from "http";
import GameService from "../service/GameService";
import LobbyService from "../service/LobbyService";
import PlayerService from "../service/PlayerService";
import CardType from "../entity/CardType";
import { LobbyState } from "../service/LobbyMessageService";
import { GameState } from "../service/GameMessageService";

interface RequestSocketOnEvents {
    "disconnect": () => void;

    "updateConfigs": (keys: string[], value: number | boolean) => void;
    "newOwner": (name: string) => void;
    "removePlayer": (name: string) => void;
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

    "contestar": (card?: CardType, selfCard?: number) => void;
    "bloquear": (card?: CardType, selfCard?: number) => void;
    "continuar": () => void;
}

export interface ResponseSocketEmitEvents {
    "playerConnected": (lobbyState: LobbyState) => void;
    "configsUpdated": (keys: string[], value: number | boolean) => void;
    "newPlayer": (player: string) => void;
    "leavingPlayer": (index: number) => void;
    "newOwner": (name: string) => void;
    "beginMatch": (gameState: GameState) => void;

    "updatePlayer": (updates: GameState) => void;
    "gameActionError": (message: string) => void;
}

export type SocketEmitLobbyEvents = "playerConnected" |
    "configsUpdated" |
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

    serverSocket.on("connection", (socket: COUPSocket) => {
        PlayerService.setListeners(socket);

        LobbyService.setListeners(socket);

        GameService.setListeners(socket);
    });
}