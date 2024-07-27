import { Server, Socket } from "socket.io";
import { Server as HTTPServer} from "http";
import GameService from "../service/GameService";
import LobbyService from "../service/LobbyService";
import PlayerService from "../service/PlayerService";
import CardType from "../entity/CardType";
import { LobbyState } from "../service/LobbyMessageService";

interface RequestSocketOnEvents {
    "disconnect": () => void;

    "updateConfigs": (keys: string[], value: number | boolean) => void;
    "newOwner": (name: string) => void;
    "removePlayer": (name: string) => void;
    "beginMatch": () => void;

    "renda": () => void;
    "ajudaExterna": () => void;
    "taxar": (card: CardType) => void;

    "extorquir": (card: CardType, targetName: string) => void;

    "assassinar": (card: CardType, targetName: string, playerCard: number) => void;
    "investigar": (card: CardType, targetName: string, playerCard: number) => void;
    "golpeEstado": (targetName: string, playerCard: number) => void;

    "trocarReligiaoOutro": (targetName: string) => void;
    "trocarReligiaoPropria": () => void;

    "trocar": (card: CardType, targetName?: string, playerCard?: number) => void;
    "manter": () => void;

    "contestar": (targetName: string) => void;
    "bloquear": (card: CardType, targetName: string) => void;
    "aceitar": () => void;
}

export interface ResponseSocketEmitEvents {
    "playerConnected": (lobbyState: LobbyState) => void;
    "configsUpdated": (keys: string[], value: number | boolean) => void;
    "newPlayer": (player: string) => void;
    "leavingPlayer": (index: number) => void;
    "newOwner": (name: string) => void;
}

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