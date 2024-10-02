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
            auth.lobby !== undefined
            &&
            PlayerService.getPlayerByName(auth.name, auth.lobby) !== undefined
        )
            return "Este nome já está sendo usado nesse lobby";

        return undefined;
    }
}