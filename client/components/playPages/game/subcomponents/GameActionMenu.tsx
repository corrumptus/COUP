import { Action, Card } from "@pages/GameView";
import InfluenceCard from "@components/InfluenceCard";
import { Config, COUPSocket } from "@utils/socketAPI";
import { getChoosableCards } from "@utils/utils";

export type MenuTypes = "money" | "othersCard" | "selfCard" | "cardChooser" | "defense" | "investigating";

export type ActionRequeriments = {
  action?: Action,
  choosedCardType?: Card,
  choosedSelfCard?: number,
  target?: string,
  choosedTargetCard?: number
}

export default function GameActionMenu({
  type,
  changeMenuType,
  requeriments,
  addRequeriment,
  configs,
  investigatedCard,
  playerMoney,
  asylum,
  socket
}: {
  type: MenuTypes,
  changeMenuType: (menuType: MenuTypes | undefined) => void,
  requeriments: ActionRequeriments,
  addRequeriment: <K extends keyof ActionRequeriments>
    (requerimentType: K, requeriment: ActionRequeriments[K]) => void,
  configs: Config,
  investigatedCard?: Card,
  playerMoney?: number,
  asylum: number,
  socket: COUPSocket
}) {
  let children: JSX.Element | null = null;
  const optionStyles = "bg-neutral-300 h-[72px] p-3 flex flex-col items-center justify-center rounded-xl hover:scale-110 cursor-pointer"
  const choosableCards = getChoosableCards(configs, requeriments.action as Action, type, requeriments);

  function cardChooserClickHandler(carta: Card) {
    if (requeriments.action === Action.TAXAR) {
      socket.emit("taxar", carta);
      return;
    }

    if (requeriments.action === Action.ASSASSINAR) {
      socket.emit("assassinar", carta, requeriments.target as string, requeriments.choosedTargetCard as number);
      return;
    }

    if (requeriments.action === Action.INVESTIGAR) {
      socket.emit("investigar", carta, requeriments.target as string, requeriments.choosedTargetCard as number);
      return;
    }

    if (requeriments.action === Action.TROCAR) {
      socket.emit("trocar", carta, requeriments.target as string, requeriments.choosedTargetCard as number);
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
          addRequeriment("action", Action.TAXAR);
          changeMenuType("cardChooser");
        }}
      >
        <h4>Taxar</h4>
      </div>
      {configs.religiao &&
        <div
          className={optionStyles}
          onClick={() => {
            addRequeriment("action", Action.CORRUPCAO);
            // TODO: escolher a carta que deve ser apostada como uma carta que pode pegar dinheiro do asilo
          }}
        >
          <h4>Corrupção</h4>
          <p>${asylum}</p>
        </div>
      }
    </>
  )

  if (type === "othersCard") children = (
    <>
      <div
        className={`${playerMoney! >= configs.quantidadeMaximaGolpeEstado && "bg-slate-500"} ${optionStyles}`}
        onClick={() => {
          if (playerMoney! >= configs.quantidadeMaximaGolpeEstado)
            return;

          addRequeriment("action", Action.ASSASSINAR);
          changeMenuType("cardChooser");
        }}
      >
        <h4>Assassinar</h4>
      </div>
      <div
        className={`${playerMoney! >= configs.quantidadeMaximaGolpeEstado && "bg-slate-500"} ${optionStyles}`}
        onClick={() => {
          if (playerMoney! >= configs.quantidadeMaximaGolpeEstado)
            return;

          addRequeriment("action", Action.INVESTIGAR);
          changeMenuType("cardChooser");
        }}
      >
        <h4>Investigar</h4>
      </div>
      <div
        className={`${playerMoney! < configs.quantidadeMinimaGolpeEstado && "bg-slate-500"} ${optionStyles}`}
        onClick={() => playerMoney! >= configs.quantidadeMinimaGolpeEstado && socket.emit("golpeEstado", requeriments.target as string, requeriments.choosedTargetCard as number)}
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
          addRequeriment("action", Action.TROCAR);
          changeMenuType("cardChooser");
        }}
      >
        <h4>Trocar 1</h4>
      </div>
      <div
        className={optionStyles}
        onClick={() => {
          addRequeriment("action", Action.TROCAR);
          addRequeriment("choosedTargetCard", undefined);
          changeMenuType("cardChooser");
        }}
      >
        <h4>Trocar 2</h4>
      </div>
    </>
  )

  if (type === "cardChooser") children = (
    <>
      {choosableCards.includes(Card.DUQUE) &&
        <InfluenceCard
          card={Card.DUQUE}
          onClick={() => cardChooserClickHandler(Card.DUQUE)}
        />
      }
      {choosableCards.includes(Card.CAPITAO) &&
        <InfluenceCard
          card={Card.CAPITAO}
          onClick={() => cardChooserClickHandler(Card.CAPITAO)}
        />
      }
      {choosableCards.includes(Card.ASSASSINO) &&
        <InfluenceCard
          card={Card.ASSASSINO}
          onClick={() => cardChooserClickHandler(Card.ASSASSINO)}
        />
      }
      {choosableCards.includes(Card.CONDESSA) &&
        <InfluenceCard
          card={Card.CONDESSA}
          onClick={() => cardChooserClickHandler(Card.CONDESSA)}
        />
      }
      {choosableCards.includes(Card.EMBAIXADOR) &&
        <InfluenceCard
          card={Card.EMBAIXADOR}
          onClick={() => cardChooserClickHandler(Card.EMBAIXADOR)}
        />
      }
      {choosableCards.includes(Card.INQUISIDOR) &&
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
        // onClick={() => socket.emit("contestar")}
      >
        <h4>Contestar</h4>
      </div>
      <div
        className={optionStyles}
        // onClick={() => socket.emit("bloquear")}
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
            onClick={() => socket.emit("trocar", requeriments.choosedCardType as Card, requeriments.target as string, requeriments.choosedTargetCard as number)}
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

        changeMenuType(undefined)
      }}
    >
      {children}
    </div>
  )
}