import { COUPSocket } from "../socket/socket";
import LobbyService from "./LobbyService";
import PlayerService from "./PlayerService";

export default class SocketValidatorService {
    static validate(socket: COUPSocket): string | undefined {
        const auth = socket.handshake.auth;

        if (
            !("name" in auth)
            &&
            !("token" in auth)
            &&
            !("sessionCode" in auth)
        )
            return "O usuário deve estar logado ou escolher um nome";

        if ("name" in auth && !SocketValidatorService.isString(auth.name))
            return "O nome deve ser uma string";

        if ("token" in auth && !SocketValidatorService.isString(auth.token))
            return "O token deve ser uma string";

        if ("sessionCode" in auth && !SocketValidatorService.isString(auth.sessionCode))
            return "O sessionCode deve ser uma string";

        if (
            "lobby" in auth &&
            auth.lobby !== undefined &&
            !SocketValidatorService.isNumber(auth.lobby)
        )
            return "O lobby deve ser um número ou não ser informado";

        if (
            auth.lobby !== undefined
            &&
            auth.lobby < 0
        )
            return "O usuário deve escolher um lobby ou criar seu próprio";

        if (
            auth.lobby !== undefined
            &&
            LobbyService.getLobby(auth.lobby) === undefined
        )
            return "Este lobby não existe";

        if (
            auth.sessionCode !== undefined
            &&
            PlayerService.getReconnectingPlayer(auth.sessionCode) === undefined
        )
            return "Este código de sessão é inválido";

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

    private static isString(variable: any): variable is string {
        return (
            variable !== null &&
            typeof variable === "string"
        );
    }

    private static isNumber(variable: any): variable is number {
        return (
            variable !== null &&
            typeof variable === "number" &&
            !isNaN(variable)
        );
    }
}