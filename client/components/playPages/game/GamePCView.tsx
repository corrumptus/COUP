import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Action, Card, GameState, Religion } from "@pages/GameView";
import ConfigDiff from "@components/ConfigDiff";
import GameActionMenu, { MenuTypes } from "@components/GameActionMenu";
import GamePcFooter from "@components/GamePcFooter";
import Players from "@components/Players";
import { COUPSocket, configDiff } from "@utils/socketAPI";

export default function GamePCView({
  isDiffsVisible,
  closeDiffs,
  gameState,
  action,
  changeAction,
  menuType,
  changeMenuType,
  requeriments,
  setRequeriments,
  socket
}: {
  isDiffsVisible: boolean,
  closeDiffs: () => void,
  gameState: GameState,
  action: Action | undefined,
  changeAction: (action: Action | undefined) => void,
  menuType: MenuTypes | undefined,
  changeMenuType: (menuType: MenuTypes | undefined) => void,
  requeriments: {[key: string]: any},
  setRequeriments: Dispatch<SetStateAction<{ [key: string]: any;}>>,
  socket: COUPSocket
}) {
  const router = useRouter();

  function changeReligion() {
    if (gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado)
      return;

    if (gameState.player.money < gameState.game.configs.quantidadeTrocarPropriaReligiao)
      return;

    socket.emit("trocarReligiaoPropria")
  }

  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex justify-between text-2xl gap-2 p-1.5 pr-2 bg-[#eaaf73]">
        <div
          className="flex items-center gap-3 cursor-pointer"
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
      </header>
      <main className="h-full flex flex-col relative overflow-hidden bg-[url(../public/game-page.png)] bg-cover bg-bottom">
        {gameState.player.religion && (
          gameState.player.religion === Religion.CATOLICA ?
            <Image
              src="/catolico-icon.png"
              alt="cruz católica"
              title="católico"
              className="absolute top-0 left-0 cursor-pointer hover:scale-110"
              onClick={changeReligion}
              width={40}
              height={40}
            />
            :
            <Image
              src="/protestante-icon.png"
              alt="biblia"
              title="protestante"
              className="absolute top-0 left-0 cursor-pointer hover:scale-110"
              onClick={changeReligion}
              width={40}
              height={40}
            />
          )
        }
        {isDiffsVisible &&
          <ConfigDiff
            configDiff={configDiff(gameState.game.configs)}
            disappear={closeDiffs}
          />
        }
        <Players
          players={gameState.game.players}
          changeAction={changeAction}
          changeMenuType={changeMenuType}
          setRequeriments={setRequeriments}
          socket={socket}
        />
        <GamePcFooter
          player={gameState.player}
          changeMenuType={changeMenuType}
          setRequeriments={setRequeriments}
          configs={gameState.game.configs}
        />
        {menuType !== undefined &&
          <GameActionMenu
            type={menuType}
            changeMenuType={changeMenuType}
            action={action}
            changeAction={changeAction}
            requeriments={requeriments}
            setRequeriments={setRequeriments}
            configs={gameState.game.configs}
            investigatedCard={gameState.game.players.find(p => p.name === requeriments["player"])
              ?.cards[requeriments["playerCard"]].card as Card}
            playerMoney={gameState.player.money}
            asylum={gameState.game.asylum}
            socket={socket}
          />
        }
      </main>
    </div>
  )
}