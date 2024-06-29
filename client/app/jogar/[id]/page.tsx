"use client"

import { useState } from "react";
import GameView, { GameState } from "@pages/GameView";
import LobbyView from "@pages/LobbyView";
import { useSocket } from "@utils/socketAPI";

async function getURL(lobbyID: number): Promise<string> {
  const response = await fetch("http://localhost:5000/lobby/" + lobbyID.toString(), {
    method: "PUT",
    headers: {
      Authorization: localStorage.getItem("coup-token") as string
    }
  });

  const result = await response.json();

  if (!response.ok)
    throw new Error((result as { error: string }).error);

  return (result as { url: string }).url;
}

export default async function EntrarLobby({ params: { id } }: { params: { id: number } }) {
  const [ isGameInited, setIsGameInited ] = useState(false);
  const [ gameState, setGameState ] = useState<GameState>();
  const socket = useSocket(await getURL(id));

  function gameInitHandler(gameState: GameState) {
    setGameState(gameState);

    setIsGameInited(true);
  }

  return !isGameInited ?
    <LobbyView initGame={gameInitHandler} socket={socket} />
    :
    <GameView gameState={gameState as GameState} socket={socket} />
}