import { Action, Card, GameState, Player } from "@pages/GameView";
import InfluenceCard from "@components/InfluenceCard";
import { getChoosableCards } from "@utils/utils";
import { ChangeRequest } from "@utils/UIChanger";

export enum MenuTypes {
  CLOSED,
  MONEY,
  ATTACK,
  CARD_CHOOSER,
  CARD_PICKING,
  CARD_PICKING_CHANGE,
  INVESTIGATING,
  DEFENSE,
  BLOCK_DEFENSE
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
  requeriments,
  performChange,
}: {
  type: MenuTypes,
  gameState: GameState,
  requeriments: ActionRequeriments,
  performChange: (changeRequest: ChangeRequest) => void,
}) {
  let children: JSX.Element | null = null;
  const optionStyles = "bg-neutral-300 h-[72px] p-3 flex flex-col items-center justify-center rounded-xl hover:scale-110 cursor-pointer"
  const choosableCards = getChoosableCards(gameState.game.configs, type, requeriments);
  const investigatedCard = gameState.game.players.find(p => p.name === requeriments.target)
    ?.cards[requeriments.choosedTargetCard as number].card as Card;

  if (type === MenuTypes.MONEY) children = (
    <>
      <div
        className={optionStyles}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.RENDA });
        }}
      >
        <h4>Renda</h4>
        <p>${gameState.game.configs.renda}</p>
      </div>
      <div
        className={optionStyles}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.AJUDA_EXTERNA });
        }}
      >
        <h4>Ajuda Externa</h4>
        <p>${gameState.game.configs.ajudaExterna}</p>
      </div>
      <div
        className={optionStyles}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.TAXAR });
        }}
      >
        <h4>Taxar</h4>
      </div>
      {gameState.game.configs.religiao &&
        <div
          className={optionStyles}
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.CORRUPCAO });
          }}
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
        className={`${gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado && "bg-neutral-500"} ${optionStyles}`}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.ASSASSINAR });
        }}
      >
        <h4>Assassinar</h4>
      </div>
      <div
        className={`${gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado && "bg-neutral-500"} ${optionStyles}`}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.INVESTIGAR });
        }}
      >
        <h4>Investigar</h4>
      </div>
      <div
        className={`${gameState.player.money < gameState.game.configs.quantidadeMinimaGolpeEstado && "bg-neutral-500"} ${optionStyles}`}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.GOLPE_ESTADO });
        }}
      >
        <h4>Golpe de Estado</h4>
        <p>${gameState.game.configs.quantidadeMinimaGolpeEstado}</p>
      </div>
    </>
  )

  if (type === MenuTypes.CARD_CHOOSER) children = (
    <>
      {choosableCards.includes(Card.DUQUE) &&
        <InfluenceCard
          card={Card.DUQUE}
          onClick={e => {
            e.stopPropagation();
            performChange({ choosedCardType: Card.DUQUE });
          }}
        />
      }
      {choosableCards.includes(Card.CAPITAO) &&
        <InfluenceCard
          card={Card.CAPITAO}
          onClick={e => {
            e.stopPropagation();
            performChange({ choosedCardType: Card.CAPITAO });
          }}
        />
      }
      {choosableCards.includes(Card.ASSASSINO) &&
        <InfluenceCard
          card={Card.ASSASSINO}
          onClick={e => {
            e.stopPropagation();
            performChange({ choosedCardType: Card.ASSASSINO });
          }}
        />
      }
      {choosableCards.includes(Card.CONDESSA) &&
        <InfluenceCard
          card={Card.CONDESSA}
          onClick={e => {
            e.stopPropagation();
            performChange({ choosedCardType: Card.CONDESSA });
          }}
        />
      }
      {choosableCards.includes(Card.EMBAIXADOR) &&
        <InfluenceCard
          card={Card.EMBAIXADOR}
          onClick={e => {
            e.stopPropagation();
            performChange({ choosedCardType: Card.EMBAIXADOR });
          }}
        />
      }
      {choosableCards.includes(Card.INQUISIDOR) &&
        <InfluenceCard
          card={Card.INQUISIDOR}
          onClick={e => {
            e.stopPropagation();
            performChange({ choosedCardType: Card.INQUISIDOR });
          }}
        />
      }
    </>
  )

  if (type === MenuTypes.CARD_PICKING) children = (
    <>
      <InfluenceCard
        card={(requeriments.target !== undefined ?
          (gameState.game.players.find(p => p.name === requeriments.target) as Player)
            .cards[0]
          :
          gameState.player.cards[0]).card
        }
        onClick={e => {
          e.stopPropagation();
          performChange({
            [requeriments.target !== undefined ?
              "choosedTargetCard"
              :
              "choosedSelfCard"
            ]: 0
          });
        }}
      />
      <InfluenceCard
        card={(requeriments.target !== undefined ?
          (gameState.game.players.find(p => p.name === requeriments.target) as Player)
            .cards[1]
          :
          gameState.player.cards[1]).card
        }
        onClick={e => {
          e.stopPropagation();
          performChange({
            [requeriments.target !== undefined ?
              "choosedTargetCard"
              :
              "choosedSelfCard"
            ]: 1
          });
        }}
      />
    </>
  )

  if (type === MenuTypes.CARD_PICKING_CHANGE) children = (
    <>
      <InfluenceCard
        card={gameState.player.cards[0].card}
        onClick={e => {
          e.stopPropagation();
          performChange({
            choosedTargetCard: 0
          });
        }}
      />
      <InfluenceCard
        card={gameState.player.cards[1].card}
        onClick={e => {
          e.stopPropagation();
          performChange({
            choosedTargetCard: 1
          });
        }}
      />
    </>
  )

  if (type === MenuTypes.BLOCK_DEFENSE) children = (
    <>
      <div
        className={optionStyles}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.CONTESTAR });
        }}
      >
        <h4>Contestar</h4>
      </div>
      <div
        className={optionStyles}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.CONTINUAR });
        }}
      >
        <h4>Aceitar</h4>
      </div>
    </>
  )

  if (type === MenuTypes.DEFENSE) children = (
    <>
      <div
        className={optionStyles}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.CONTESTAR });
        }}
      >
        <h4>Contestar</h4>
      </div>
      <div
        className={optionStyles}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.BLOQUEAR });
        }}
      >
        <h4>Bloquear</h4>
      </div>
      <div
        className={optionStyles}
        onClick={e => {
          e.stopPropagation();
          performChange({ action: Action.CONTINUAR });
        }}
      >
        <h4>Aceitar</h4>
      </div>
    </>
  )

  if (type === MenuTypes.INVESTIGATING) children = (
    <>
      <div className="flex flex-col flex-wrap gap-4 items-center justify-center">
        <InfluenceCard card={investigatedCard} />
        <div className="flex gap-4 items-center">
          <div
            className={optionStyles}
            onClick={e => {
              e.stopPropagation();
              performChange({ action: Action.TROCAR });
            }}
          >
            <h4>Trocar</h4>
          </div>
          <div
            className={optionStyles}
            onClick={e => {
              e.stopPropagation();
              performChange({ action: Action.CONTINUAR });
            }}
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