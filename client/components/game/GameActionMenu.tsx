import InfluenceCard from "@components/game/InfluenceCard";
import { getChoosableCards } from "@utils/utils";
import { Action, ContextType, GameState } from "@type/game";
import {
  ActionRequeriments,
  ChangeRequest,
  MenuTypes
} from "@type/gameUI";
import { GameCardVersions, useRandomCardVersion } from "@hooks/useCardVersions";

export default function GameActionMenu({
  type,
  gameState,
  gameCardVersions,
  requeriments,
  performChange,
}: {
  type: MenuTypes,
  gameState: GameState,
  gameCardVersions: GameCardVersions,
  requeriments: ActionRequeriments,
  performChange: (changeRequest: ChangeRequest) => void,
}) {
  let children: JSX.Element | null = null;
  const optionStyles = "bg-neutral-300 h-[72px] p-3 flex flex-col items-center justify-center rounded-xl hover:scale-110 cursor-pointer"

  if (type === MenuTypes.MONEY) children = (
    <div
      className="flex flex-col gap-4 items-center"
      id="gameView-moneyMenu"
      data-testid="gameView-moneyMenu"
    >
      <h3 className="text-center text-2xl">Escolha uma forma de obter dinheiro</h3>
      <div className="flex gap-4">
        <button
          className={optionStyles}
          id="gameView-rendaButton"
          data-testid="gameView-rendaButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.RENDA });
          }}
        >
          <h4>Renda</h4>
          <p>${gameState.game.configs.renda}</p>
        </button>
        <button
          className={optionStyles}
          id="gameView-ajudaExternaButton"
          data-testid="gameView-ajudaExternaButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.AJUDA_EXTERNA });
          }}
        >
          <h4>Ajuda Externa</h4>
          <p>${gameState.game.configs.ajudaExterna}</p>
        </button>
        <button
          className={optionStyles}
          id="gameView-taxarButton"
          data-testid="gameView-taxarButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.TAXAR });
          }}
        >
          <h4>Taxar</h4>
        </button>
        {gameState.game.configs.religiao.reforma &&
          <button
            className={`${gameState.game.asylum === 0 && "bg-neutral-500"} ${optionStyles}`}
            id="gameView-corrupcaoButton"
            data-testid="gameView-corrupcaoButton"
            onClick={e => {
              e.stopPropagation();
              performChange({ action: Action.CORRUPCAO });
            }}
          >
            <h4>Corrupção</h4>
            <p>${gameState.game.asylum}</p>
          </button>
        }
      </div>
    </div>
  )

  if (type === MenuTypes.ATTACK) children = (
    <div
      className="flex flex-col gap-4 items-center"
      id="gameView-attackMenu"
      data-testid="gameView-attackMenu"
    >
      <h3 className="text-center text-2xl">Escolha uma forma de atacar {requeriments.target}</h3>
      <div className="flex gap-4">
        <button
          className={`${gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado && "bg-neutral-500"} ${optionStyles}`}
          id="gameView-assassinarButton"
          data-testid="gameView-assassinarButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.ASSASSINAR });
          }}
        >
          <h4>Assassinar</h4>
        </button>
        <button
          className={`${gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado && "bg-neutral-500"} ${optionStyles}`}
          id="gameView-investigarButton"
          data-testid="gameView-investigarButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.INVESTIGAR });
          }}
        >
          <h4>Investigar</h4>
        </button>
        <button
          className={`${gameState.player.money < gameState.game.configs.quantidadeMinimaGolpeEstado && "bg-neutral-500"} ${optionStyles}`}
          id="gameView-golpeEstadoButton"
          data-testid="gameView-golpeEstadoButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.GOLPE_ESTADO });
          }}
        >
          <h4>Golpe de Estado</h4>
          <p>${gameState.game.configs.quantidadeMinimaGolpeEstado}</p>
        </button>
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
      <div
        className="flex flex-col gap-4 items-center"
        id="gameView-cardChooserMenu"
        data-testid="gameView-cardChooserMenu"
      >
        <h3 className="text-center text-2xl">
          Escolha que tipo de carta usar para {requeriments.action}
        </h3>
        <div className="flex gap-6">
          {choosableCards.map(card =>
            <button
              key={card}
              id={`gameView-${card}ChoosableCard`}
              data-testid={`gameView-${card}ChoosableCard`}
              onClick={e => {
                e.stopPropagation();
                performChange({ cardType: card });
              }}
            >
              <InfluenceCard
                card={card}
                cardVersion={useRandomCardVersion()}
                className="hover:scale-110 cursor:pointer"
              />
            </button>
          )}
        </div>
      </div>
    )
  }

  if (type === MenuTypes.CARD_PICKING) children = (
    <div
      className="flex flex-col gap-4 items-center"
      id="gameView-cardPickingMenu"
      data-testid="gameView-cardPickingMenu"
    >
      <h3 className="text-center text-2xl">Escolha qual das suas cartas usar</h3>
      <div className="flex gap-6">
        {!gameState.player.cards[0].isDead &&
          <button
            id="gameView-firstPickableCard"
            data-testid="gameView-firstPickableCard"
            onClick={e => {
              e.stopPropagation();
              performChange({ selfCard: 0 });
            }}
          >
            <InfluenceCard
              card={gameState.player.cards[0].card}
              cardVersion={gameCardVersions.player[0]}
              className="hover:scale-110 cursor-pointer"
            />
          </button>
        }
        {!gameState.player.cards[1].isDead &&
          <button
            id="gameView-secondPickableCard"
            data-testid="gameView-secondPickableCard"
            onClick={e => {
              e.stopPropagation();
              performChange({ selfCard: 1 });
            }}
          >
            <InfluenceCard
              card={gameState.player.cards[1].card}
              cardVersion={gameCardVersions.player[1]}
              className="hover:scale-110 cursor-pointer"
            />
          </button>
        }
      </div>
    </div>
  )

  if (type === MenuTypes.CARD_PICKING_CHANGE) children = (
    <div
      className="flex flex-col gap-4 items-center"
      id="gameView-cardPickingChangeMenu"
      data-testid="gameView-cardPickingChangeMenu"
    >
      <h3 className="text-center text-2xl">Escolha qual das suas cartas deve ser trocada</h3>
      <div className="flex gap-6">
        <button
          id="gameView-firstPickableChangeCard"
          data-testid="gameView-firstPickableChangeCard"
          onClick={e => {
            e.stopPropagation();
            performChange({ targetCard: 0 });
          }}
        >
          <InfluenceCard
            card={gameState.player.cards[0].card}
            cardVersion={gameCardVersions.player[0]}
            className="hover:scale-110 cursor-pointer"
          />
        </button>
        <button
          id="gameView-secondPickableChangeCard"
          data-testid="gameView-secondPickableChangeCard"
          onClick={e => {
            e.stopPropagation();
            performChange({ targetCard: 1 });
          }}
        >
          <InfluenceCard
            card={gameState.player.cards[1].card}
            cardVersion={gameCardVersions.player[1]}
            className="hover:scale-110 cursor-pointer"
          />
        </button>
      </div>
    </div>
  )

  if (
    type === MenuTypes.DEFENSE
    &&
    gameState.context.type === ContextType.BEING_ATTACKED
  ) children = (
    <div
      className="flex flex-col gap-4 items-center"
      id="gameView-defenseMenu"
      data-testid="gameView-defenseMenu"
    >
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
        <button
          className={optionStyles}
          id="gameView-bloquearButton"
          data-testid="gameView-bloquearButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.BLOQUEAR });
          }}
        >
          <h4>Bloquear</h4>
        </button>
        <button
          className={optionStyles}
          id="gameView-contestarButton"
          data-testid="gameView-contestarButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.CONTESTAR });
          }}
        >
          <h4>Contestar</h4>
        </button>
        <button
          className={optionStyles}
          id="gameView-continuarButton"
          data-testid="gameView-continuarButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.CONTINUAR });
          }}
        >
          <h4>Aceitar</h4>
        </button>
      </div>
    </div>
  )

  if (
    type === MenuTypes.BLOCK_DEFENSE
    &&
    gameState.context.type === ContextType.BEING_ATTACKED
  ) children = (
    <div
      className="flex flex-col gap-4 items-center"
      id="gameView-blockDefenseMenu"
      data-testid="gameView-blockDefenseMenu"
    >
      <h2 className="text-lg">
        O player {gameState.context.attacker + " "}
        está te bloqueando
        com a carta {gameState.context.card + " "}
      </h2>
      <h3 className="text-center text-2xl">Escolha a sua ação</h3>
      <div className="flex gap-6">
        <button
          className={optionStyles}
          id="gameView-contestarButton"
          data-testid="gameView-contestarButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.CONTESTAR });
          }}
        >
          <h4>Contestar</h4>
        </button>
        <button
          className={optionStyles}
          id="gameView-continuarButton"
          data-testid="gameView-continuarButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.CONTINUAR });
          }}
        >
          <h4>Aceitar</h4>
        </button>
      </div>
    </div>
  )

  if (
    type === MenuTypes.INVESTIGATING
    &&
    gameState.context.type === ContextType.INVESTIGATING
  ) children = (
    <div
      className="flex flex-col flex-wrap gap-4 items-center justify-center"
      id="gameView-investigatingMenu"
      data-testid="gameView-investigatingMenu"
    >
      <span
        id="gameView-investigatedCard"
        data-testid="gameView-investigatedCard"
      >
        <InfluenceCard
          card={gameState.context.investigatedCard}
          cardVersion={gameCardVersions
            .gamePlayers[gameState.context.target][gameState.context.targetCard]
          }
        />
      </span>
      <h3 className="text-center text-2xl">Escolha a próxima ação</h3>
      <div className="flex gap-4 items-center">
        <button
          className={optionStyles}
          id="gameView-trocarButton"
          data-testid="gameView-trocarButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.TROCAR });
          }}
        >
          <h4>Trocar</h4>
        </button>
        <button
          className={optionStyles}
          id="gameView-continuarButton"
          data-testid="gameView-continuarButton"
          onClick={e => {
            e.stopPropagation();
            performChange({ action: Action.CONTINUAR });
          }}
        >
          <h4>Manter</h4>
        </button>
      </div>
    </div>
  )

  return (
    <div
      className="w-full h-full flex items-center justify-center absolute bg-black/70 z-10"
      onClick={() => performChange({ goTo: MenuTypes.CLOSED })}
      id="gameView-actionMenu"
      data-testid="gameView-actionMenu"
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