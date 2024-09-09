import { COUPSocket } from "../socket/socket";

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
            return "Usuário deve estar logado ou escolher um nome";

        return undefined;
    }
}