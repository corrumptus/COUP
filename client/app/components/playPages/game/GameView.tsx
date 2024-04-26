import socket, { Config, configDiff } from "@/app/utils/socketAPI";
import Image from "next/image";
import Players from "./Players";
import GamePcFooter from "./GamePcFooter";
import GameActionMenu, { MenuTypes } from "./GameActionMenu";
import { useEffect, useState } from "react";
import useDeviceWidth from "@/app/utils/utils";
import GameMobileMenu from "./GameMobileMenu";
import ConfigDiff from "./ConfigDiff";

export enum Religion {
  PROTESTANTE = "PROTESTANTE",
  CATOLICA = "CATOLICA"
}

export enum Card {
  DUQUE = "duque",
  CAPITAO = "capitao",
  ASSASSINO = "assassino",
  CONDESSA = "condessa",
  EMBAIXADOR = "embaixador",
  INQUISIDOR = "inquisidor"
}

export enum Action {
  RENDA = "renda",
  AJUDA_EXTERNA = "ajudaExterna",
  GOLPE_ESTADO = "golpeEstado",
  TAXAR = "taxar",
  ASSASSINAR = "assassinar",
  EXTORQUIR = "extorquir",
  TROCAR = "trocar",
  INVESTIGAR = "inventigar",
  TROCAR_RELIGIAO = "trocarReligiao",
  CONTESTAR = "contestar",
  BLOQUEAR = "bloquear"
}

export type Player = {
  name: string;
  cards: { card: Card | undefined, isDead: boolean }[];
  money: number;
  religion?: Religion
}

export type Turn = {
  player: Player;
  target?: Player;
  actions: Action[];
}

export type GameState = {
  player: Player;
  game: {
    players: Player[];
    currentPlayer: Player;
    currentTurn: Turn;
    configs: Config;
  }
}

export default function GameView({ gameState }: { gameState: GameState }) {
  const [ menuType, setMenuType ] = useState<MenuTypes | undefined>(undefined);
  const [ action, setAction ] = useState<Action | undefined>(undefined);
  const [ requeriments, setRequeriments ] = useState<{[key: string]: any}>({});
  const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false);
  const [ isDiffsVisible, setIsDiffsVisible ] = useState(true);
  const width = useDeviceWidth();

  function getCardsCanBeChoosed(): Card[] {
    return Object.entries(gameState.game.configs.tiposCartas)
      .filter(([ _, cardInfos ]) => {
        const canAct = cardInfos[action as keyof typeof cardInfos] as boolean

        let canTrocar = true
        let quantidadeTrocar = requeriments["playerCard"] !== undefined ? 1 : 2

        if (action === Action.TROCAR) {
          if (menuType === "selfCard")
            canTrocar = quantidadeTrocar >= cardInfos["quantidadeTrocarPropria"]
          else
            canTrocar = quantidadeTrocar >= cardInfos["quantidadeTrocarOutroJogador"]
        }

        return canAct && canTrocar;
      })
      .map(([ card, _ ]) => card) as Card[];
  }

  useEffect(() => {
    if (gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado && menuType !== "othersCard")
      setMenuType(undefined)
  }, [menuType, action, requeriments]);

  if (width < 800) return (
    <div className="w-full h-full flex flex-col">
      <header className="flex justify-between text-2xl gap-2 p-1.5 pr-2 bg-[#eaaf73]">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => socket.emit("quit")}
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
            disappear={() => setIsDiffsVisible(false)}
          />
        }
        <GameMobileMenu
          player={gameState.player}
          setMenuType={setMenuType}
          setRequeriments={setRequeriments}
          configs={gameState.game.configs}
          isOpen={isMobileMenuOpen}
        />
        <Players
          players={gameState.game.players}
          setAction={setAction}
          setMenuType={setMenuType}
          setRequeriments={setRequeriments}
        />
        {menuType !== undefined &&
          <GameActionMenu
            type={menuType}
            setMenuType={setMenuType}
            action={action}
            setAction={setAction}
            requeriments={requeriments}
            setRequeriments={setRequeriments}
            configs={gameState.game.configs}
            cardsCanBeChoosed={getCardsCanBeChoosed()}
            investigatedCard={gameState.game.players.find(p => p.name === requeriments["player"])
              ?.cards[requeriments["playerCard"]].card as Card}
            playerMoney={gameState.player.money}
          />
        }
      </main>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex justify-between text-2xl gap-2 p-1.5 pr-2 bg-[#eaaf73]">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => socket.emit("quit")}
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
      <main className="h-full flex flex-col relative overflow-hidden bg-[url(../public/game-page.webp)] bg-cover bg-bottom">
        {gameState.player.religion && gameState.player.religion === Religion.CATOLICA ?
          <Image
            src="/catolico-icon.png"
            alt="cruz católica"
            title="católico"
            className="absolute top-0 left-0 cursor-pointer hover:scale-110"
            onClick={() => gameState.player.money < gameState.game.configs.quantidadeMinimaGolpeEstado
              && socket.emit("trocarReligiaoPropria")}
            width={40}
            height={40}
          />
          :
          <Image
            src="/protestante-icon.png"
            alt="biblia"
            title="protestante"
            className="absolute top-0 left-0 cursor-pointer hover:scale-110"
            onClick={() => gameState.player.money < gameState.game.configs.quantidadeMinimaGolpeEstado
              && socket.emit("trocarReligiaoPropria")}
            width={40}
            height={40}
          />
        }
        {isDiffsVisible &&
          <ConfigDiff
            configDiff={configDiff(gameState.game.configs)}
            disappear={() => setIsDiffsVisible(false)}
          />
        }
        <Players
          players={gameState.game.players}
          setAction={setAction}
          setMenuType={setMenuType}
          setRequeriments={setRequeriments}
        />
        <GamePcFooter
          player={gameState.player}
          setMenuType={setMenuType}
          setRequeriments={setRequeriments}
          configs={gameState.game.configs}
        />
        {menuType !== undefined &&
          <GameActionMenu
            type={menuType}
            setMenuType={setMenuType}
            action={action}
            setAction={setAction}
            requeriments={requeriments}
            setRequeriments={setRequeriments}
            configs={gameState.game.configs}
            cardsCanBeChoosed={getCardsCanBeChoosed()}
            investigatedCard={gameState.game.players.find(p => p.name === requeriments["player"])
              ?.cards[requeriments["playerCard"]].card as Card}
            playerMoney={gameState.player.money}
          />
        }
      </main>
    </div>
  )
}