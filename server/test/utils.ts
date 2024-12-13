import { faker } from "@faker-js/faker";
import type { Socket } from "socket.io";
import type { RequestSocketOnEvents } from "@socket/socket";

export function createSocket(
    lobbyId: number | undefined,
    password?: string
): jest.Mocked<Socket> {
    return {
        id: faker.number.int().toString(),
        handshake: {
            auth: {
                name: faker.person.fullName(),
                lobby: lobbyId,
                password: password
            },
            headers: {
                "user-agent": faker.internet.userAgent()
            }
        },
        emit: jest.fn(),
        on: jest.fn(),
        disconnect: jest.fn()
    } as any;
}

export function getSocketOnCB<T extends keyof RequestSocketOnEvents | string & {}>(
    socket: jest.Mocked<Socket>,
    event: T
): T extends keyof RequestSocketOnEvents ? RequestSocketOnEvents[T] : Function {
    return (
        socket.on.mock.calls
            .find(([ ev ]) => ev === event) as [
                string,
                T extends keyof RequestSocketOnEvents ?
                    RequestSocketOnEvents[T]
                    :
                    Function
            ]
    )[1];
}