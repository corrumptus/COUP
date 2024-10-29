import InfluenceCard from "@components/InfluenceCard";
import { getChoosableCards } from "@utils/utils";
import { Action, Card, ContextType, GameState } from "@types/game";
import {
  ActionRequeriments,
  ChangeRequest,
  MenuTypes
} from "@types/gameUI";

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

  if (type === MenuTypes.MONEY) children = (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="text-center text-2xl">Escolha uma forma de conseguir dinheiro</h3>
      <div className="flex gap-4">
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
      </div>
    </div>
  )

  if (type === MenuTypes.ATTACK) children = (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="text-center text-2xl">Escolha uma forma de atacar {requeriments.target}</h3>
      <div className="flex gap-4">
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
      </div>
    </div>
  )

  if (type === MenuTypes.CARD_CHOOSER) {
    const choosableCards = getChoosableCards(
      requeriments.action as Action,
      gameState.game.configs,
      (gameState.context as { action?: Action }).action
    );

    children = (
      <div className="flex flex-col gap-4 items-center">
        <h3 className="text-center text-2xl">Escolha que tipo de carta usar para {requeriments.action}</h3>
        <div className="flex gap-6">
          {choosableCards.includes(Card.DUQUE) &&
            <InfluenceCard
              card={Card.DUQUE}
              customStyle="hover:scale-110 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                performChange({ cardType: Card.DUQUE });
              }}
            />
          }
          {choosableCards.includes(Card.CAPITAO) &&
            <InfluenceCard
              card={Card.CAPITAO}
              customStyle="hover:scale-110 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                performChange({ cardType: Card.CAPITAO });
              }}
            />
          }
          {choosableCards.includes(Card.ASSASSINO) &&
            <InfluenceCard
              card={Card.ASSASSINO}
              customStyle="hover:scale-110 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                performChange({ cardType: Card.ASSASSINO });
              }}
            />
          }
          {choosableCards.includes(Card.CONDESSA) &&
            <InfluenceCard
              card={Card.CONDESSA}
              customStyle="hover:scale-110 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                performChange({ cardType: Card.CONDESSA });
              }}
            />
          }
          {choosableCards.includes(Card.EMBAIXADOR) &&
            <InfluenceCard
              card={Card.EMBAIXADOR}
              customStyle="hover:scale-110 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                performChange({ cardType: Card.EMBAIXADOR });
              }}
            />
          }
          {choosableCards.includes(Card.INQUISIDOR) &&
            <InfluenceCard
              card={Card.INQUISIDOR}
              customStyle="hover:scale-110 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                performChange({ cardType: Card.INQUISIDOR });
              }}
            />
          }
        </div>
      </div>
    )
  }

  if (type === MenuTypes.CARD_PICKING) children = (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="text-center text-2xl">Escolha qual das suas cartas usar</h3>
      <div className="flex gap-6">
        {!gameState.player.cards[0].isDead &&
          <InfluenceCard
            customStyle="hover:scale-110 cursor-pointer"
            card={gameState.player.cards[0].card}
            onClick={e => {
              e.stopPropagation();
              performChange({ selfCard: 0 });
            }}
          />
        }
        {!gameState.player.cards[1].isDead &&
          <InfluenceCard
            customStyle="hover:scale-110 cursor-pointer"
            card={gameState.player.cards[1].card}
            onClick={e => {
              e.stopPropagation();
              performChange({ selfCard: 1 });
            }}
          />
        }
      </div>
    </div>
  )

  if (type === MenuTypes.CARD_PICKING_CHANGE) children = (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="text-center text-2xl">Escolha qual das suas cartas deve ser trocada</h3>
      <div className="flex gap-6">
        <InfluenceCard
          card={gameState.player.cards[0].card}
          customStyle="hover:scale-110 cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            performChange({ targetCard: 0 });
          }}
        />
        <InfluenceCard
          card={gameState.player.cards[1].card}
          customStyle="hover:scale-110 cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            performChange({ targetCard: 1 });
          }}
        />
      </div>
    </div>
  )

  if (
    type === MenuTypes.DEFENSE
    &&
    gameState.context.type === ContextType.BEING_ATTACKED
  ) children = (
    <div className="flex flex-col gap-4 items-center">
      {gameState.context.attackedCard === undefined ? 
        <h2>
          O player {gameState.context.attacker + " "}
          está te atacando com {gameState.context.action + " "}
          usando a carta {gameState.context.card + " "}
        </h2>
        :
        <h2>
          O player {gameState.context.attacker + " "}
          está atacando a sua {gameState.context.attackedCard + " "}
          com {gameState.context.action + " "}
          usando a carta {gameState.context.card + " "}
        </h2>
      }
      <h3 className="text-center text-2xl">Escolha a próxima ação</h3>
      <div className="flex gap-6">
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
      </div>
    </div>
  )

  if (
    type === MenuTypes.BLOCK_DEFENSE
    &&
    gameState.context.type === ContextType.BEING_ATTACKED
  ) children = (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-lg">
        O player {gameState.context.attacker + " "}
        está te bloqueando
        com a carta {gameState.context.card + " "}
      </h2>
      <h3 className="text-center text-2xl">Escolha a sua ação</h3>
      <div className="flex gap-6">
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
      </div>
    </div>
  )

  if (
    type === MenuTypes.INVESTIGATING
    &&
    gameState.context.type === ContextType.INVESTIGATING
  ) children = (
    <div className="flex flex-col flex-wrap gap-4 items-center justify-center">
      <InfluenceCard card={gameState.context.investigatedCard} />
      <h3 className="text-center text-2xl">Escolha a próxima ação</h3>
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
  )

  return (
    <div
      className="w-full h-full flex items-center justify-center absolute bg-black/70 z-10"
      onClick={() => performChange({ goTo: MenuTypes.CLOSED })}
    >
      <div
        className="w-[70%] h-[60%] flex items-center justify-center overflow-auto bg-stone-500 rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}