import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Player from "@components/Player";
import Configuracoes from "@components/Configuracoes";
import { GameState } from "../game/GameView";
import { Config, useSocket } from "@utils/socketAPI";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";

export type LobbyState = {
  player: {
    name: string
  },
  lobby: {
    id: number,
    players: string[],
    owner: string,
    configs: Config
  }
}

export default function LobbyView({ id, initGame }: { id: number, initGame: (gameState: GameState) => void }) {
  const [ lobbyState, setLobbyState ] = useState<LobbyState>({
    player: {
      name: ""
    },
    lobby: {
      id: id,
      players: [],
      owner: "",
      configs: COUPDefaultConfigs
    }
  });

  const canEdit = lobbyState.player.name !== "" && lobbyState.player.name === lobbyState.lobby.owner;

  const router = useRouter();

  const socket = useSocket("http://localhost:5000");

  socket.on("playerConnected", (lobbyState: LobbyState) => {
    setLobbyState(lobbyState);
  });

  socket.on("configsUpdate", (keys: string[], value: number | boolean) => {
    const newLobbyState: LobbyState = JSON.parse(JSON.stringify(lobbyState));
    let configParam: any = newLobbyState.lobby.configs;

    for (let i = 0; i < keys.length-1; i++)
      configParam = configParam[keys[i]];

    configParam[keys.at(-1) as string] = value;

    setLobbyState(newLobbyState);
  });

  socket.on("newPlayer", (player: string) => {
    const newLobbyState: LobbyState = JSON.parse(JSON.stringify(lobbyState));

    newLobbyState.lobby.players.push(player);

    setLobbyState(newLobbyState);
  });

  socket.on("leavingPlayer", (index: number) => {
    const newLobbyState: LobbyState = JSON.parse(JSON.stringify(lobbyState));

    newLobbyState.lobby.players.splice(index, 1);

    setLobbyState(newLobbyState);
  });

  socket.on("gameInit", initGame);

  return (
    <div className="h-full flex flex-col">
      <header className="flex justify-between text-2xl gap-2 p-1.5 pr-2 bg-[#eaaf73]">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            socket.disconnect();
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
            {lobbyState.lobby.players.map(p => <Player
                key={p}
                name={p}
                canEdit={canEdit}
              />
            )}
          </ul>
        </div>
        <div className="w-full pc:w-[calc((100%-2.5rem)/2)] h-[500px] pc:h-full flex flex-col gap-1.5 bg-[url(../public/papiro.png)] bg-[length:100%_100%] bg-no-repeat px-[5%] pc:px-[2%] pt-[55px] pb-[65px] pc:pt-[calc(((100vh-52px-5rem)/2)*0.2)] pc:pb-[calc(((100vh-52px-5rem)/2)*0.24)]">
          <h2 className="text-center text-2xl pc:text-3xl">Configurações</h2>
          <Configuracoes
            configs={lobbyState.lobby.configs}
            canEdit={canEdit}
          />
        </div>
      </main>
    </div>
  )
}