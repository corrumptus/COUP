import LobbyService from "@services/LobbyService";
import PlayerService from "@services/SocketConnectionService";
import SocketStoreService from "@services/SocketStoreService";
import UserService from "@services/UserService";

type SocketConnectionData = {
    name: string,
    lobby?: string,
    password?: string,
    token?: string,
    reconnectionToken?: number
}

export default class SocketValidator {
    static validateConnectionData(data: object): asserts data is SocketConnectionData {
        SocketValidator.validateName(data);

        SocketValidator.validateLobby(data as object & { name: string });

        SocketValidator.validateToken(data);

        SocketValidator.validateReconnectionCode(data);

        SocketValidator.validatePassword(data as object & { lobby: string });
    }

    private static validateName(data: object) {
        if (!("name" in data))
            throw new Error("O usuário deve estar logado ou escolher um nome");

        if (!SocketValidator.isString(data.name))
            throw new Error("O nome deve ser uma string");

        if (data.name.trim() === "")
            throw new Error("O nome deve conter um ou mais caractéres");
    }

    private static validateLobby(data: object & { name: string }) {
        if (!("lobby" in data))
            return;

        if (!SocketValidator.isString(data.lobby))
            throw new Error("O lobby deve ser um número ou não ser informado");

        if (SocketStoreService.getLobby(data.lobby) === undefined)
            throw new Error("Este lobby não existe");

        if (SocketStoreService.playerExists(data.lobby, data.name))
            throw new Error("Este nome já está sendo usado nesse lobby");
    }

    private static validateReconnectionCode(data: object) {
        if (!("reconnectionCode" in data))
            return;

        if (!("lobby" in data))
            throw new Error("A reconexão requer um lobby");

        if (SocketStoreService.getLobby(data.lobby as string) === undefined)
            throw new Error("O Lobby não existe");

        if (!LobbyService.isRunningGame(data.lobby as string))
            throw new Error("A reconexão só pode acontecer em um lobby que o jogo já tenha começado");

        if (!SocketValidator.isNumber(data.reconnectionCode))
            throw new Error("O código de reconexão deve ser um número");

        if (
            data.reconnectionCode <= 0
            ||
            data.reconnectionCode > 1000000
        )
            throw new Error("O código de reconexão é inválido");

        if (!PlayerService.reconnectionCodeExists(data.reconnectionCode))
            throw new Error("O código de reconexão é inválido");
    }

    private static validateToken(data: object) {
        if (!("token" in data))
            return;

        if (!SocketValidator.isString(data.token))
            throw new Error("O token deve ser uma string");

        (async () => {
            if (!await UserService.isValidToken(data.token))
                throw new Error("O token é inválido");
        })();
    }

    private static validatePassword(data: object & { lobby: string }) {
        if (!LobbyService.hasPasswordInLobby(data.lobby))
            return;

        if (!("password" in data))
            throw new Error("O Lobby requer uma senha");

        if (!SocketValidator.isString(data.password))
            throw new Error("A senha deve ser uma string");

        if (!LobbyService.isLobbyPassword(data.lobby, data.password))
            throw new Error("A senha está incorreta");
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