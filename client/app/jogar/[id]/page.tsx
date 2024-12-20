"use client"

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import GameView from "@pages/GameView";
import LobbyView from "@pages/LobbyView";
import useSocket from "@utils/socketAPI";
import type { GameState } from "@type/game";

export default function EntrarLobby() {
  const { id } = useParams() as { id: string };

  const [ gameState, setGameState ] = useState<GameState>();
  const { socket, error } = useSocket(id === "-1" ? undefined : id);

  if (error !== undefined) return <Error error={error}/>

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

function Error({ error }: { error: string }) {
  const router = useRouter();

  return (
    <div className="h-full flex justify-center items-center">
      <div
        className="absolute top-2 left-2 flex gap-3 items-center cursor-pointer"
        onClick={() => {
          localStorage.removeItem("coup-sessionCode")
          router.push("/");
        }}
      >
        <Image
          src="/coup-logo.png"
          alt="logo"
          width={50}
          height={50}
        />
        <span>Voltar</span>
      </div>
      {error}
    </div>
  );
}