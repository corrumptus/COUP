"use client"

import { useEffect, useRef, useState } from "react";
import { initSocket } from "@/app/utils/socketAPI";
import LobbyView from "@/app/components/playPages/lobby/LobbyView";
import GameView, { GameState } from "@/app/components/playPages/game/GameView";

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

export default function EntrarLobby({ params: { id } }: { params: { id: number } }) {
  const [ isGameInited, setGameInited ] = useState(false);
  const inGameStateRef = useRef<GameState>();

  useEffect(() => {
    (async ()=> {
      initSocket(await getURL(id));
    })();
  }, [id]);

  function gameInitHandler(gameState: GameState) {
    inGameStateRef.current = gameState;

    setGameInited(true);
  }

  return !isGameInited ?
    <LobbyView initGame={gameInitHandler} id={id}/>
    :
    <GameView gameState={inGameStateRef.current as GameState}/>
}