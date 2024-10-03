import { COUPSocket } from "../socket/socket";
import LobbyService from "./LobbyService";
import PlayerService from "./PlayerService";

export default class SocketValidatorService {
    static validate(socket: COUPSocket): string | undefined {
        const auth = socket.handshake.auth;
        if (
            (
                !("token" in auth)
                &&
                !("name" in auth)
            )
        )
            return "O usuário deve estar logado ou escolher um nome";

        if (
            auth.lobby === undefined
            ||
            isNaN(auth.lobby)
            ||
            auth.lobby < -1
        )
            return "O usuário deve escolher um lobby para entrar ou criar seu próprio";

        if (
            LobbyService.getLobby(auth.lobby) === undefined
        )
            return "Este lobby não existe";

        if (
            "name" in auth
            &&
            auth.lobby !== undefined
            &&
            PlayerService.getPlayerByName(auth.name, auth.lobby) !== undefined
        )
            return "Este nome já está sendo usado nesse lobby";

        return undefined;
    }
}