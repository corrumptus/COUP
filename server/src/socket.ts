import { Server, Socket } from "socket.io";
import { Server as HTTPServer} from "http";
import GameService from "./service/GameService";
import LobbyService from "./service/LobbyService";
import PlayerService from "./service/PlayerService";
import ModifiedSocket from "./utils/ModifiedSocket";

export default function initSocket(server: HTTPServer) {
    const serverSocket: Server = new Server(server);

    serverSocket.on("connection", (socket: Socket) => {
        const modifiedSocket: ModifiedSocket = new ModifiedSocket(socket);

        PlayerService.setListeners(modifiedSocket);

        LobbyService.setListeners(modifiedSocket);

        GameService.setListeners(modifiedSocket);
    });
}