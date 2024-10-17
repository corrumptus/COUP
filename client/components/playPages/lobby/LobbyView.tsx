import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GameState } from "@pages/GameView";
import Player from "@components/Player";
import Configuracoes from "@components/Configuracoes";
import { COUPSocket, Config } from "@utils/socketAPI";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";

export type LobbyState = {
  player: {
    name: string
  },
  lobby: {
    id: number,
    players: string[],
    owner: string,
    configs: Config,
    password: string | undefined
  }
}

export default function LobbyView({
  initGame,
  socket,
  changeIdWhenCreating
}: {
  initGame: (gameState: GameState) => void,
  socket: COUPSocket,
  changeIdWhenCreating: (id: number) => void
}) {
  const [ lobbyState, setLobbyState ] = useState<LobbyState>({
    player: {
      name: ""
    },
    lobby: {
      id: 0,
      players: [],
      owner: "",
      configs: COUPDefaultConfigs,
      password: undefined
    }
  });

  const canEdit = lobbyState.player.name !== "" && lobbyState.player.name === lobbyState.lobby.owner;

  const router = useRouter();

  useEffect(() => {
    socket.on("disconnect", () => {
      localStorage.removeItem("coup-sessionCode");
    });

    socket.on("playerConnected", (lobbyState: LobbyState) => {
      setLobbyState(lobbyState);

      changeIdWhenCreating(lobbyState.lobby.id);
    });

    socket.on("configsUpdated", (keys: string[], value: number | boolean) => {
      const newLobbyState: LobbyState = JSON.parse(JSON.stringify(lobbyState));
      let configParam: any = newLobbyState.lobby.configs;

      for (let i = 0; i < keys.length-1; i++)
        configParam = configParam[keys[i]];

      configParam[keys.at(-1) as string] = value;

      setLobbyState(newLobbyState);
    });

    socket.on("passwordUpdated", (password: string | undefined) => {
      const newLobbyState: LobbyState = JSON.parse(JSON.stringify(lobbyState));

      newLobbyState.lobby.password = password;

      setLobbyState(newLobbyState);
    });

    socket.on("newPlayer", (player: string) => {
      const newLobbyState: LobbyState = JSON.parse(JSON.stringify(lobbyState));

      newLobbyState.lobby.players.push(player);

      setLobbyState(newLobbyState);
    });

    socket.on("leavingPlayer", (player: string) => {
      const newLobbyState: LobbyState = JSON.parse(JSON.stringify(lobbyState));

      const index = newLobbyState.lobby.players.indexOf(player);

      newLobbyState.lobby.players.splice(index, 1);

      setLobbyState(newLobbyState);
    });

    socket.on("newOwner", (player: string) => {
      const newLobbyState: LobbyState = JSON.parse(JSON.stringify(lobbyState));

      newLobbyState.lobby.owner = player;

      setLobbyState(newLobbyState);
    });

    socket.on("beginMatch", (gameState: GameState, sessionCode: string) => {
      initGame(gameState);
      localStorage.setItem("coup-sessionCode", sessionCode);
    });

    return () => {
      socket.removeAllListeners("playerConnected");
      socket.removeAllListeners("configsUpdated");
      socket.removeAllListeners("passwordUpdated");
      socket.removeAllListeners("newPlayer");
      socket.removeAllListeners("leavingPlayer");
      socket.removeAllListeners("newOwner");
      socket.removeAllListeners("beginMatch");

      const lastDisconnect = socket.listeners("disconnect")[1];
      socket.removeListener("disconnect", lastDisconnect);
    }
  });

  return (
    <div className="h-full flex flex-col">
      <header className="flex justify-between text-2xl gap-2 p-1.5 pr-2 bg-[#eaaf73]">
        <div
          className="flex items-center cursor-pointer gap-2"
          onClick={() => {
            socket.disconnect();
            localStorage.removeItem("coup-sessionCode");
            router.push("/");
          }}
        >
          <Image
            src="/sair-lobby.png"
            alt="seta para a esquerda"
            className="hover:drop-shadow-lg"
            width={40}
            height={40}
          />
          <span>Sair</span>
        </div>
        {canEdit &&
          <button
            className="bg-green-400 text-white py-1 px-2 rounded-xl hover:shadow-md"
            onClick={() => socket.emit("beginMatch")}
          >Começar</button>
        }
      </header>
      <main className="pc:h-full flex flex-wrap items-center gap-10 bg-[url(../public/lobby-page.png)] bg-cover bg-center p-5 pc:p-10 pc:overflow-hidden">
        <div className="w-full pc:w-[calc((100%-2.5rem)/2)] h-[500px] pc:h-full flex flex-col gap-1.5 bg-[url(../public/papiro.png)] bg-[length:100%_100%] bg-no-repeat px-[5%] pc:px-[2%] pt-[55px] pb-[65px] pc:pt-[calc(((100vh-52px-5rem)/2)*0.2)] pc:pb-[calc(((100vh-52px-5rem)/2)*0.24)]">
          <h2 className="text-center text-2xl pc:text-3xl">Players</h2>
          <ul className="overflow-auto">
            {lobbyState.lobby.players.map(playerName => <Player
                key={playerName}
                name={playerName}
                canEdit={canEdit}
                isOwner={playerName === lobbyState.lobby.owner}
                isUser={playerName === lobbyState.player.name}
                socket={socket}
              />
            )}
          </ul>
        </div>
        <div className="w-full pc:w-[calc((100%-2.5rem)/2)] h-[500px] pc:h-full flex flex-col gap-1.5 bg-[url(../public/papiro.png)] bg-[length:100%_100%] bg-no-repeat px-[5%] pc:px-[2%] pt-[55px] pb-[65px] pc:pt-[calc(((100vh-52px-5rem)/2)*0.2)] pc:pb-[calc(((100vh-52px-5rem)/2)*0.24)]">
          <h2 className="text-center text-2xl pc:text-3xl">Configurações</h2>
          <Configuracoes
            configs={lobbyState.lobby.configs}
            canEdit={canEdit}
            password={lobbyState.lobby.password}
            socket={socket}
          />
        </div>
      </main>
    </div>
  )
}