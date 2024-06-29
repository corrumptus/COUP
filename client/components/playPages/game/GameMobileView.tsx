import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Action, Card, GameState } from "@pages/GameView";
import ConfigDiff from "@components/ConfigDiff";
import GameActionMenu, { MenuTypes } from "@components/GameActionMenu";
import GameMobileMenu from "@components/GameMobileMenu";
import Players from "@components/Players";
import { DEFAULT_SOCKET_URL, configDiff, useSocket } from "@utils/socketAPI";

export default function GameMobileView({
  isDiffsVisible,
  closeDiffs,
  gameState,
  action,
  changeAction,
  menuType,
  changeMenuType,
  requeriments,
  setRequeriments,
  getChoosableCards
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
  getChoosableCards: () => Card[]
}) {
  const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false);
  const socket = useSocket(DEFAULT_SOCKET_URL);
  const router = useRouter();

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
          setRequeriments={setRequeriments}
          configs={gameState.game.configs}
          isOpen={isMobileMenuOpen}
        />
        <Players
          players={gameState.game.players}
          changeAction={changeAction}
          changeMenuType={changeMenuType}
          setRequeriments={setRequeriments}
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
            choosableCards={getChoosableCards()}
            investigatedCard={gameState.game.players.find(p => p.name === requeriments["player"])
              ?.cards[requeriments["playerCard"]].card as Card}
            playerMoney={gameState.player.money}
          />
        }
      </main>
    </div>
  )
}