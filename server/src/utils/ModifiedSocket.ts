import { Socket } from "socket.io";
import { SocketReservedEventsMap } from "socket.io/dist/socket";
import Config from "../utils/Config";

type AceptedEvents = {
    "login": (name: string) => void;
    "disconnect": () => void;
    "createLobby": () => void;
    "enterLobby": (lobbyID: number) => void;
    "leaveLobby": (lobbyID: number) => void;
    "initGame": (customConfigs?: Config) => void;
    "renda": () => void;
    "ajudaExterna": () => void;
    "golpeEstado": (name: string) => void;
    "taxar": () => void;
    "assassinar": (name: string) => void;
    "extorquir": (name: string) => void;
    "trocar": (name?: string) => void;
    "investigar": (name: string) => void;
    "contestar": (name: string) => void;
    "bloquear": (name: string) => void;
};

type FallbackToUntypedListener<T> = [T] extends [never] ? (...args: any[]) => void | Promise<void> : T;

export default class ModifiedSocket {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    on<EV extends keyof AceptedEvents>(ev: EV, listener: AceptedEvents[EV]): this {
        this.socket.on(ev, listener as FallbackToUntypedListener<EV extends "disconnect" | "disconnecting" | "error" ? SocketReservedEventsMap[EV] : EV extends string ? (...args: any[]) => void : never>);
        return this;
    }

    get id(): string {
        return this.socket.id;
    }
}