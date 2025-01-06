import { useRouter } from "next/navigation";
import Configuracoes from "@components/game/Configuracoes";
import Header from "@components/game/Header";
import Player from "@components/game/Player";
import type LobbyState from "@type/lobby";
import type { COUPSocket } from "@type/socket";

export default function LobbyView({
  socket,
  lobbyState
}: {
  socket: COUPSocket,
  lobbyState: LobbyState
}) {
  const canEdit = lobbyState.player.name === lobbyState.lobby.owner;

  const router = useRouter();

  function leave() {
    socket.disconnect();
    localStorage.removeItem("coup-sessionCode");
    router.push("/");
  }

  return (
    <div className="h-full flex flex-col">
      <Header leave={leave}>
        {canEdit ?
          <button
            className={`${lobbyState.lobby.players.length > 1 ? "bg-green-400" : "bg-stone-500"} text-white py-1 px-2 rounded-xl hover:shadow-md`}
            onClick={() => {
              if (lobbyState.lobby.players.length <= 1)
                return;

              socket.emit("beginMatch");
            }}
          >
            Começar
          </button>
          :
          undefined
        }
      </Header>
      <main className="pc:h-full flex flex-wrap items-center gap-10 bg-[url(../public/lobby-page.png)] bg-cover bg-center p-5 pc:p-10 pc:overflow-hidden font-['augusta'] text-2xl">
        <div className="w-full pc:w-[calc((100%-2.5rem)/2)] h-[500px] pc:h-full flex flex-col gap-1.5 bg-[url(../public/papiro.png)] bg-[length:100%_100%] bg-no-repeat px-[5%] pc:px-[2%] pt-[55px] pb-[65px] pc:pt-[calc(((100vh-52px-5rem)/2)*0.2)] pc:pb-[calc(((100vh-52px-5rem)/2)*0.24)]">
          <h2 className="text-center text-4xl pc:text-3xl">Players</h2>
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
          <h2 className="text-center text-4xl pc:text-3xl">Configurações</h2>
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