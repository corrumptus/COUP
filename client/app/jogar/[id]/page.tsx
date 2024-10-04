"use client"

import { useEffect, useState } from "react";
import GameView, { GameState } from "@pages/GameView";
import LobbyView from "@pages/LobbyView";
import { useSocket } from "@utils/socketAPI";
import { newToaster } from "@utils/Toasters";

export default function EntrarLobby({ params: { id } }: { params: { id: string } }) {
  const [ gameState, setGameState ] = useState<GameState>();
  const { socket, error } = useSocket(id === "-1" ? undefined : id);

  useEffect(() => {
    if (socket === undefined)
      return;

    socket.on("gameActionError", (message: string) => {
      newToaster(message);
    });

    socket.on("updatePlayer", (newGameState: GameState) => {
      setGameState(newGameState);
    });

    return () => {
      socket.removeAllListeners("gameActionError");
      socket.removeAllListeners("updatePlayer");
    };
  });

  if (error !== undefined) return (
    <div className="h-full flex justify-center items-center">{error}</div>
  );

  return gameState === undefined ?
    <LobbyView
      initGame={setGameState}
      socket={socket}
      changeIdWhenCreating={(lobbyId: number) => {
        if (Number(id) !== lobbyId)
          window.history.replaceState(null, "", `/jogar/${lobbyId}`);
      }}
    />
    :
    <GameView gameState={gameState} socket={socket} />
}