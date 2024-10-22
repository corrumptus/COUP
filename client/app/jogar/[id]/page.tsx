"use client"

import { useState } from "react";
import GameView, { GameState } from "@pages/GameView";
import LobbyView from "@pages/LobbyView";
import { useSocket } from "@utils/socketAPI";

export default function EntrarLobby({ params: { id } }: { params: { id: string } }) {
  const [ gameState, setGameState ] = useState<GameState>();
  const { socket, error } = useSocket(id === "-1" ? undefined : id);

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
    <GameView
      gameState={gameState}
      socket={socket}
      changeGameState={setGameState}
    />
}