"use client"

import { useState } from "react";
import GameView, { GameState } from "@pages/GameView";
import LobbyView from "@pages/LobbyView";
import { enterLobby } from "@utils/socketAPI";

export default async function EntrarLobby({ params: { id } }: { params: { id: number } }) {
  const [ gameState, setGameState ] = useState<GameState>();
  const { socket, error } = await enterLobby(id);

  if (error !== undefined) return (
    <div className="h-full flex justify-center items-center">{error}</div>
  )

  return gameState === undefined ?
    <LobbyView initGame={setGameState} socket={socket} />
    :
    <GameView gameState={gameState} socket={socket} />
}