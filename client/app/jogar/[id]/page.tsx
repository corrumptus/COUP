"use client"

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import GameView from "@pages/GameView";
import LobbyView from "@pages/LobbyView";
import useSocket from "@hooks/useSocket";
import useSocketMessages from "@hooks/useSocketMessages";
import usePlayPageState from "@hooks/usePlayPageState";
import { PlayPageState } from "@type/gameUI";
import LobbyState from "@type/lobby";
import { GameState } from "@type/game";

export default function EntrarLobby() {
  const { id } = useParams() as { id: string };
  const { socket, error } = useSocket(id === "-1" ? undefined : id);

  const { pageState, viewState, setViewState } = usePlayPageState();

  useSocketMessages(
    socket,
    pageState,
    setViewState,
    (lobbyId: number) => {
      if (Number(id) !== lobbyId)
        window.history.replaceState(null, "", `/jogar/${lobbyId}`);
    }
  );

  if (error !== undefined) return <Error error={error} />

  return pageState === PlayPageState.LOBBY ?
    <LobbyView
      socket={socket}
      lobbyState={viewState as LobbyState}
    />
    :
    <GameView
      socket={socket}
      gameState={viewState as GameState}
    />
}

function Error({ error }: { error: string }) {
  const router = useRouter();

  return (
    <div className="h-full flex justify-center items-center">
      <div
        className="absolute top-2 left-2 flex gap-3 items-center cursor-pointer"
        onClick={() => {
          localStorage.removeItem("coup-sessionCode");
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