import socket, { Config } from "@/app/utils/socketAPI";
import Image from "next/image";
import { Action, Card } from "../GameView";
import InfluenceCard from "./InfluenceCard";
import { Dispatch, SetStateAction } from "react";

export type MenuTypes = "money" | "othersCard" | "selfCard" | "cardChooser" | "defense" | "investigating"

export default function GameActionMenu({
  type,
  setMenuType,
  action,
  setAction,
  requeriments,
  setRequeriments,
  configs,
  cardsCanBeChoosed,
  investigatedCard,
  playerMoney
}: {
  type: MenuTypes,
  setMenuType: Dispatch<SetStateAction<MenuTypes | undefined>>,
  action: Action | undefined,
  setAction: Dispatch<SetStateAction<Action | undefined>>,
  requeriments: {[key: string]: any},
  setRequeriments: Dispatch<SetStateAction<{[key: string]: any}>>,
  configs: Config,
  cardsCanBeChoosed?: Card[]
  investigatedCard?: Card,
  playerMoney?: number
}) {
  let children: JSX.Element | null = null;
  const optionStyles = "bg-neutral-300 h-[72px] p-3 flex flex-col items-center justify-center rounded-xl hover:scale-110 cursor-pointer"

  function cardChooserClickHandler(carta: Card) {
    if (action === Action.TAXAR) {
      socket.emit("taxar", carta)
      return;
    }

    if (action === Action.ASSASSINAR) {
      socket.emit("assassinar", carta, requeriments["player"], requeriments["playerCard"])
      return;
    }

    if (action === Action.INVESTIGAR) {
      socket.emit("investigar", carta, requeriments["player"], requeriments["playerCard"])
      return;
    }

    if (action === Action.TROCAR) {
      socket.emit("trocar", carta, requeriments["player"], requeriments["playerCard"])
      return;
    }


  }

  if (type === "money") children = (
    <>
      <div
        className={optionStyles}
        onClick={() => socket.emit("renda")}
      >
        <h4>Renda</h4>
        <p>${configs.renda}</p>
      </div>
      <div
        className={optionStyles}
        onClick={() => socket.emit("ajudaExterna")}
      >
        <h4>Ajuda Externa</h4>
        <p>${configs.ajudaExterna}</p>
      </div>
      <div
        className={optionStyles}
        onClick={() => {
          setAction(Action.TAXAR)
          setMenuType("cardChooser")
        }}
      >
        <h4>Taxar</h4>
      </div>
    </>
  )

  if (type === "othersCard") children = (
    <>
      <div
        className={`${playerMoney! >= configs.quantidadeMaximaGolpeEstado && "bg-slate-500"} ${optionStyles}`}
        onClick={() => {
          if (playerMoney! >= configs.quantidadeMaximaGolpeEstado)
            return;

          setAction(Action.ASSASSINAR)
          setMenuType("cardChooser")
        }}
      >
        <h4>Assassinar</h4>
      </div>
      <div
        className={`${playerMoney! >= configs.quantidadeMaximaGolpeEstado && "bg-slate-500"} ${optionStyles}`}
        onClick={() => {
          if (playerMoney! >= configs.quantidadeMaximaGolpeEstado)
            return;

          setAction(Action.INVESTIGAR)
          setMenuType("cardChooser")
        }}
      >
        <h4>Investigar</h4>
      </div>
      <div
        className={`${playerMoney! < configs.quantidadeMinimaGolpeEstado && "bg-slate-500"} ${optionStyles}`}
        onClick={() => playerMoney! >= configs.quantidadeMinimaGolpeEstado && socket.emit("golpeEstado", requeriments["player"], requeriments["playerCard"])}
      >
        <h4>Golpe de Estado</h4>
        <p>${configs.quantidadeMinimaGolpeEstado}</p>
      </div>
    </>
  )

  if (type === "selfCard") children = (
    <>
      <div
        className={optionStyles}
        onClick={() => {
          setAction(Action.TROCAR)
          setMenuType("cardChooser")
        }}
      >
        <h4>Trocar 1</h4>
      </div>
      <div
        className={optionStyles}
        onClick={() => {
          setAction(Action.TROCAR)
          setRequeriments(prev => ({ "player": prev["player"] }))
          setMenuType("cardChooser")
        }}
      >
        <h4>Trocar 2</h4>
      </div>
    </>
  )

  if (type === "cardChooser") children = (
    <>
      {cardsCanBeChoosed?.includes(Card.DUQUE) &&
        <InfluenceCard
          card={Card.DUQUE}
          onClick={() => cardChooserClickHandler(Card.DUQUE)}
        />
      }
      {cardsCanBeChoosed?.includes(Card.CAPITAO) &&
        <InfluenceCard
          card={Card.CAPITAO}
          onClick={() => cardChooserClickHandler(Card.CAPITAO)}
        />
      }
      {cardsCanBeChoosed?.includes(Card.ASSASSINO) &&
        <InfluenceCard
          card={Card.ASSASSINO}
          onClick={() => cardChooserClickHandler(Card.ASSASSINO)}
        />
      }
      {cardsCanBeChoosed?.includes(Card.CONDESSA) &&
        <InfluenceCard
          card={Card.CONDESSA}
          onClick={() => cardChooserClickHandler(Card.CONDESSA)}
        />
      }
      {cardsCanBeChoosed?.includes(Card.EMBAIXADOR) &&
        <InfluenceCard
          card={Card.EMBAIXADOR}
          onClick={() => cardChooserClickHandler(Card.EMBAIXADOR)}
        />
      }
      {cardsCanBeChoosed?.includes(Card.INQUISIDOR) &&
        <InfluenceCard
          card={Card.INQUISIDOR}
          onClick={() => cardChooserClickHandler(Card.INQUISIDOR)}
        />
      }
    </>
  )

  if (type === "defense") children = (
    <>
      <div
        className={optionStyles}
        onClick={() => socket.emit("contestar")}  
      >
        <h4>Contestar</h4>
      </div>
      <div
        className={optionStyles}
        onClick={() => socket.emit("bloquear")}  
      >
        <h4>Bloquear</h4>
      </div>
      <div
        className={optionStyles}
        onClick={() => socket.emit("aceitar")}  
      >
        <h4>Aceitar</h4>
      </div>
    </>
  )

  if (type === "investigating") children = (
    <>
      <div className="flex flex-col flex-wrap gap-4 items-center justify-center">
        <InfluenceCard card={investigatedCard}/>
        <div className="flex gap-4 items-center">
          <div
            className={optionStyles}
            onClick={() => socket.emit("trocar", requeriments["card"], requeriments["player"], requeriments["playerCard"])}
          >
            <h4>Trocar</h4>
          </div>
          <div
            className={optionStyles}
            onClick={() => socket.emit("manter")}
          >
            <h4>Manter</h4>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div
      className="w-full h-full flex flex-wrap items-center justify-center gap-4 absolute bg-black/70"
      onClick={() => {
        if (type === "investigating")
          socket.emit("manter")
        if (type === "defense")
          socket.emit("aceitar")

        setMenuType(undefined)
      }}
    >
      {children}
    </div>
  )
}