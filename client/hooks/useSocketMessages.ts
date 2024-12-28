import { EnemyPlayer, GameState } from "@type/game";
import { PlayPageState } from "@type/gameUI";
import LobbyState from "@type/lobby";
import { COUPSocket } from "@type/socket";
import { newToaster } from "@utils/Toasters";
import { Dispatch, SetStateAction, useEffect } from "react";

export default function useSocketMessages<T extends PlayPageState>(
    socket: COUPSocket | undefined,
    view: T,
    setter: Dispatch<SetStateAction<LobbyState | GameState>>,
    updateUrl: T extends PlayPageState.LOBBY ? (id: number) => void : never
) {
    useEffect(() => {
        if (socket === undefined)
            return;

        const cleanUp = view === PlayPageState.LOBBY ?
            lobbyViewSocketMessages(socket, setter, updateUrl)
            :
            gameViewSocketMessages(socket, setter);

        socket.emit("canReceive");

        return () => {
            socket.emit("cantReceive");

            cleanUp();
        };
    }, [socket, view]);
}

function lobbyViewSocketMessages(
    socket: COUPSocket,
    setter: Dispatch<SetStateAction<LobbyState | GameState>>,
    updateUrl: (id: number) => void
) {
    socket.on("playerConnected", (lobbyState: LobbyState) => {
        setter(lobbyState);
        updateUrl(lobbyState.lobby.id);
    });

    socket.on("configsUpdated", (keys: string[], value: number | boolean) => {
        setter(prevLobbyState => {
            const newLobbyState: LobbyState = JSON.parse(JSON.stringify(prevLobbyState));
            let configParam: any = newLobbyState.lobby.configs;

            for (let i = 0; i < keys.length - 1; i++)
                configParam = configParam[keys[i]];

            configParam[keys.at(-1) as string] = value;

            return newLobbyState;
        });
    });

    socket.on("passwordUpdated", (password: string | undefined) => {
        setter(prevLobbyState => {
            const newLobbyState: LobbyState = JSON.parse(JSON.stringify(prevLobbyState));

            newLobbyState.lobby.password = password;

            return newLobbyState;
        });
    });

    socket.on("newPlayer", (player: string) => {
        console.log(socket.listeners("newPlayer"));
        setter(prevLobbyState => {
            const newLobbyState: LobbyState = JSON.parse(JSON.stringify(prevLobbyState));

            newLobbyState.lobby.players.push(player);

            return newLobbyState;
        });
    });

    socket.on("leavingPlayer", (player: string) => {
        setter(prevLobbyState => {
            const newLobbyState: LobbyState = JSON.parse(JSON.stringify(prevLobbyState));

            const index = newLobbyState.lobby.players.indexOf(player);

            newLobbyState.lobby.players.splice(index, 1);

            return newLobbyState;
        });
    });

    socket.on("newOwner", (player: string) => {
        setter(prevLobbyState => {
            const newLobbyState: LobbyState = JSON.parse(JSON.stringify(prevLobbyState));

            newLobbyState.lobby.owner = player;

            return newLobbyState;
        });
    });

    socket.on("reconnectingLobby", (lobbyId: number) => {
        updateUrl(lobbyId);
    });

    socket.on("beginMatch", (gameState: GameState, sessionCode: string) => {
        setter(gameState);
        localStorage.setItem("coup-sessionCode", sessionCode);
    });

    return () => {
        socket.removeAllListeners("playerConnected");
        socket.removeAllListeners("configsUpdated");
        socket.removeAllListeners("passwordUpdated");
        socket.removeAllListeners("newPlayer");
        socket.removeAllListeners("leavingPlayer");
        socket.removeAllListeners("newOwner");
        socket.removeAllListeners("reconnectingLobby");
        socket.removeAllListeners("beginMatch");
    };
}

function gameViewSocketMessages(
    socket: COUPSocket,
    setter: Dispatch<SetStateAction<LobbyState | GameState>>
) {
    socket.on("gameActionError", (message: string) => {
        newToaster(message);
    });

    socket.on("updatePlayer", (newGameState: GameState) => {
        setter(newGameState);
    });

    socket.on("addPlayer", (player: EnemyPlayer) => {
        setter(prevGameState => {
            const newGameState: GameState = JSON.parse(JSON.stringify(prevGameState));

            newGameState.game.players.push(player);

            return newGameState;
        });
    });

    socket.on("leavingPlayer", (player: string) => {
        setter(prevGameState => {
            const newGameState: GameState = JSON.parse(JSON.stringify(prevGameState));

            const index = newGameState.game.players.findIndex(p => p.name === player);

            if (index === -1)
                return prevGameState;

            newGameState.game.players.splice(index, 1);

            return newGameState;
        });
    });

    return () => {
        socket.removeAllListeners("gameActionError");
        socket.removeAllListeners("updatePlayer");
        socket.removeAllListeners("addPlayer");
        socket.removeAllListeners("leavingPlayer");
    };
}