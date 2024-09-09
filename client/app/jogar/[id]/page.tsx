"use client"

import { useState } from "react";
import GameView, { GameState } from "@pages/GameView";
import LobbyView from "@pages/LobbyView";
import { useSocket } from "@utils/socketAPI";

export default function EntrarLobby() {
  const [ gameState, setGameState ] = useState<GameState>();
  const { socket, error } = useSocket();

  if (error !== undefined) return (
    <div className="h-full flex justify-center items-center">{error}</div>
  );

  return gameState === undefined ?
    <LobbyView initGame={setGameState} socket={socket} />
    :
    <GameView gameState={gameState} socket={socket} />
}