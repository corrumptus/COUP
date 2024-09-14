import { COUPSocket } from "../socket/socket";
import PlayerService from "./PlayerService";

export default class SocketValidatorService {
    static validate(socket: COUPSocket): string | undefined {
        const auth = socket.handshake.auth;
        if (
            Object.keys(auth).length === 0
            ||
            (
                !("token" in auth)
                &&
                !("name" in auth)
            )
        )
            return "O usuário deve estar logado ou escolher um nome";

        if (
            "name" in auth
            &&
            PlayerService.getAwaitedPlayer(auth.name) === undefined
        )
            return "O usuário deve escolher um lobby ou criar seu próprio";

        if (
            "name" in auth
            &&
            PlayerService.getAwaitedPlayer(auth.name) !== undefined
            &&
            (
                PlayerService.getAwaitedPlayer(auth.name)?.lobbyId
                ===
                PlayerService.getPlayersLobbyByName(auth.name)?.id
            )
        )
            return "Este nome já está sendo usado nesse lobby";

        return undefined;
    }
}