import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, GameState } from "@pages/GameView";
import ConfigDiff from "@components/ConfigDiff";
import GameActionMenu, { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";
import GameMobileMenu from "@components/GameMobileMenu";
import Players from "@components/Players";
import { COUPSocket, configDiff } from "@utils/socketAPI";
import { menuTypeFrom } from "@utils/utils";

export default function GameMobileView({
  isDiffsVisible,
  closeDiffs,
  gameState,
  menuType,
  changeMenuType,
  requeriments,
  addRequeriment,
  socket
}: {
  isDiffsVisible: boolean,
  closeDiffs: () => void,
  gameState: GameState,
  menuType: MenuTypes | undefined,
  changeMenuType: (menuType: MenuTypes | undefined) => void,
  requeriments: ActionRequeriments,
  addRequeriment: <K extends keyof ActionRequeriments>
    (requerimentType: K, requeriment: ActionRequeriments[K]) => void,
  socket: COUPSocket
}) {
  const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false);
  const router = useRouter();

  function changeOthersReligion(name: string) {
    if (gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado)
      return;

    if (gameState.player.money < gameState.game.configs.quantidadeTrocarPropriaReligiao)
      return;

    if (menuTypeFrom(gameState.player.state) !== undefined)
      return;

    socket.emit("trocarReligiaoOutro", name);
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
        <Image
          src="/menu-hamburguer-icon.png"
          alt="menu hamburguer"
          className=""
          onClick={() => setIsMobileMenuOpen(is => !is)}
          width={40}
          height={40}
        />
      </header>
      <main className="h-full flex flex-col relative overflow-hidden bg-[url(../public/game-page.png)] bg-cover bg-bottom">
        {isDiffsVisible &&
          <ConfigDiff
            configDiff={configDiff(gameState.game.configs)}
            disappear={closeDiffs}
          />
        }
        <GameMobileMenu
          player={gameState.player}
          changeMenuType={changeMenuType}
          addRequeriment={addRequeriment}
          configs={gameState.game.configs}
          isOpen={isMobileMenuOpen}
          socket={socket}
        />
        <Players
          players={gameState.game.players}
          changeReligion={changeOthersReligion}
          changeMenuType={changeMenuType}
          addRequeriment={addRequeriment}
          socket={socket}
        />
        {menuType !== undefined &&
          <GameActionMenu
            type={menuType}
            changeMenuType={changeMenuType}
            requeriments={requeriments}
            addRequeriment={addRequeriment}
            configs={gameState.game.configs}
            investigatedCard={gameState.game.players.find(p => p.name === requeriments.target)
              ?.cards[requeriments.choosedTargetCard as number].card as Card}
            playerMoney={gameState.player.money}
            asylum={gameState.game.asylum}
            socket={socket}
          />
        }
      </main>
    </div>
  )
}