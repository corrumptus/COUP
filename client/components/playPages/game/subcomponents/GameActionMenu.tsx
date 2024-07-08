import { Action, Card, GameState } from "@pages/GameView";
import InfluenceCard from "@components/InfluenceCard";
import { getChoosableCards } from "@utils/utils";
import { ChangeRequest } from "@utils/UIChanger";

export enum MenuTypes {
  MONEY = "money",
  ATTACK = "attack",
  CHANGE_CARDS = "changeCards",
  CARD_CHOOSER = "cardChooser",
  INVESTIGATING = "investigating",
  DEFENSE = "defense",
  BLOCK_DEFENSE = "blockDefense",
  CLOSED = "closed"
}

export type ActionRequeriments = {
  action?: Action,
  choosedCardType?: Card,
  choosedSelfCard?: number,
  target?: string,
  choosedTargetCard?: number
}

export default function GameActionMenu({
  type,
  gameState,
  performChange,
}: {
  type: MenuTypes,
  gameState: GameState
  performChange: (changeRequest: ChangeRequest) => void,
}) {
  let children: JSX.Element | null = null;
  const optionStyles = "bg-neutral-300 h-[72px] p-3 flex flex-col items-center justify-center rounded-xl hover:scale-110 cursor-pointer"
  const choosableCards = getChoosableCards(gameState.game.configs, requeriments.action as Action, type, requeriments);

  if (type === MenuTypes.MONEY) children = (
    <>
      <div
        className={optionStyles}
        onClick={() => performChange({ action: Action.RENDA })}
      >
        <h4>Renda</h4>
        <p>${gameState.game.configs.renda}</p>
      </div>
      <div
        className={optionStyles}
        onClick={() => performChange({ action: Action.AJUDA_EXTERNA })}
      >
        <h4>Ajuda Externa</h4>
        <p>${gameState.game.configs.ajudaExterna}</p>
      </div>
      <div
        className={optionStyles}
        onClick={() => performChange({ action: Action.TAXAR })}
      >
        <h4>Taxar</h4>
      </div>
      {gameState.game.configs.religiao &&
        <div
          className={optionStyles}
          onClick={() => performChange({ action: Action.CORRUPCAO })}
        >
          <h4>Corrupção</h4>
          <p>${gameState.game.asylum}</p>
        </div>
      }
    </>
  )

  if (type === MenuTypes.ATTACK) children = (
    <>
      <div
        className={`${gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado && "bg-slate-500"} ${optionStyles}`}
        onClick={() => performChange({ action: Action.ASSASSINAR })}
      >
        <h4>Assassinar</h4>
      </div>
      <div
        className={`${gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado && "bg-slate-500"} ${optionStyles}`}
        onClick={() => performChange({ action: Action.INVESTIGAR })}
      >
        <h4>Investigar</h4>
      </div>
      <div
        className={`${gameState.player.money < gameState.game.configs.quantidadeMinimaGolpeEstado && "bg-slate-500"} ${optionStyles}`}
        onClick={() => performChange({ action: Action.GOLPE_ESTADO })}
      >
        <h4>Golpe de Estado</h4>
        <p>${gameState.game.configs.quantidadeMinimaGolpeEstado}</p>
      </div>
    </>
  )

  if (type === MenuTypes.CHANGE_CARDS) children = (
    <>
      <div
        className={optionStyles}
        onClick={() => performChange({ action: Action.TROCAR })}
      >
        <h4>Trocar 1</h4>
      </div>
      <div
        className={optionStyles}
        onClick={() => performChange({ action: Action.TROCAR })}
      >
        <h4>Trocar 2</h4>
      </div>
    </>
  )

  if (type === MenuTypes.CARD_CHOOSER) children = (
    <>
      {choosableCards.includes(Card.DUQUE) &&
        <InfluenceCard
          card={Card.DUQUE}
          onClick={() => performChange({ choosedCardType: Card.DUQUE })}
        />
      }
      {choosableCards.includes(Card.CAPITAO) &&
        <InfluenceCard
          card={Card.CAPITAO}
          onClick={() => performChange({ choosedCardType: Card.CAPITAO })}
        />
      }
      {choosableCards.includes(Card.ASSASSINO) &&
        <InfluenceCard
          card={Card.ASSASSINO}
          onClick={() => performChange({ choosedCardType: Card.ASSASSINO })}
        />
      }
      {choosableCards.includes(Card.CONDESSA) &&
        <InfluenceCard
          card={Card.CONDESSA}
          onClick={() => performChange({ choosedCardType: Card.CONDESSA })}
        />
      }
      {choosableCards.includes(Card.EMBAIXADOR) &&
        <InfluenceCard
          card={Card.EMBAIXADOR}
          onClick={() => performChange({ choosedCardType: Card.EMBAIXADOR })}
        />
      }
      {choosableCards.includes(Card.INQUISIDOR) &&
        <InfluenceCard
          card={Card.INQUISIDOR}
          onClick={() => performChange({ choosedCardType: Card.INQUISIDOR })}
        />
      }
    </>
  )

  if (type === MenuTypes.BLOCK_DEFENSE) children = (
    <>
      <div
        className={optionStyles}
        onClick={() => performChange({ action: Action.CONTESTAR })}
      >
        <h4>Contestar</h4>
      </div>
      <div
        className={optionStyles}
        onClick={() => performChange({ action: Action.CONTINUAR })}
      >
        <h4>Aceitar</h4>
      </div>
    </>
  )

  if (type === MenuTypes.DEFENSE) children = (
    <>
      <div
        className={optionStyles}
        onClick={() => performChange({ action: Action.CONTESTAR })}
      >
        <h4>Contestar</h4>
      </div>
      <div
        className={optionStyles}
        onClick={() => performChange({ action: Action.BLOQUEAR })}
      >
        <h4>Bloquear</h4>
      </div>
      <div
        className={optionStyles}
        onClick={() => performChange({ action: Action.CONTINUAR })}
      >
        <h4>Aceitar</h4>
      </div>
    </>
  )

  if (type === MenuTypes.INVESTIGATING) children = (
    <>
      <div className="flex flex-col flex-wrap gap-4 items-center justify-center">
        <InfluenceCard card={investigatedCard}/>
        <div className="flex gap-4 items-center">
          <div
            className={optionStyles}
            onClick={() => performChange({ action: Action.TROCAR })}
          >
            <h4>Trocar</h4>
          </div>
          <div
            className={optionStyles}
            onClick={() => performChange({ action: Action.CONTINUAR })}
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
      onClick={() => performChange({ goTo: MenuTypes.CLOSED })}
    >
      {children}
    </div>
  )
}