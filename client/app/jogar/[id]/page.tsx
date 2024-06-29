"use client"

import { useEffect, useState } from "react";
import GameView, { GameState } from "@pages/GameView";
import LobbyView from "@pages/LobbyView";
import initSocket from "@utils/socketAPI";

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
  const [ isGameInited, setIsGameInited ] = useState(false);
  const [ gameState, setGameState ] = useState<GameState>();

  useEffect(() => {
    (async ()=> {
      initSocket(await getURL(id));
    })();
  }, [id]);

  function gameInitHandler(gameState: GameState) {
    setGameState(gameState);

    setIsGameInited(true);
  }

  return !isGameInited ?
    <LobbyView initGame={gameInitHandler} id={id}/>
    :
    <GameView gameState={gameState as GameState}/>
}