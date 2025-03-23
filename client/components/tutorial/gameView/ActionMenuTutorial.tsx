import { useState } from "react";
import InfluenceCard from "@components/game/InfluenceCard";
import { getChoosableCards } from "@utils/utils";
import { Action, GameState } from "@type/game";
import { ActionRequeriments, CardVersion, MenuTypes } from "@type/gameUI";
import { useRandomCardVersion } from "@hooks/useCardVersions";

export default function ActionMenuTutorial({
  type,
  gameState,
  requeriments
}: {
  type: MenuTypes,
  gameState: GameState,
  requeriments: ActionRequeriments
}) {
  const [[ firstVariant, secondVariant, investigationVariant ]] = useState([
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3)
  ]);
  let children: JSX.Element | null = null;
  const optionStyles = "bg-neutral-300 h-[72px] p-3 flex flex-col items-center justify-center rounded-xl hover:scale-110 cursor-pointer"

  if (type === MenuTypes.MONEY) children = (
    <div
      className="flex flex-col gap-4 items-center"
    >
      <h3 className="text-center text-2xl">Escolha uma forma de obter dinheiro</h3>
      <div className="flex gap-4">
        <button
          className={optionStyles}
        >
          <h4>Renda</h4>
          <p>${gameState.game.configs.renda}</p>
        </button>
        <button
          className={optionStyles}
        >
          <h4>Ajuda Externa</h4>
          <p>${gameState.game.configs.ajudaExterna}</p>
        </button>
        <button
          className={optionStyles}
        >
          <h4>Taxar</h4>
        </button>
        {gameState.game.configs.religiao.reforma &&
          <button
            className={`${gameState.game.asylum === 0 && "bg-neutral-500"} ${optionStyles}`}
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
    >
      <h3 className="text-center text-2xl">Escolha uma forma de atacar {requeriments.target}</h3>
      <div className="flex gap-4">
        <button
          className={`${gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado && "bg-neutral-500"} ${optionStyles}`}
        >
          <h4>Assassinar</h4>
        </button>
        <button
          className={`${gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado && "bg-neutral-500"} ${optionStyles}`}
        >
          <h4>Investigar</h4>
        </button>
        <button
          className={`${gameState.player.money < gameState.game.configs.quantidadeMinimaGolpeEstado && "bg-neutral-500"} ${optionStyles}`}
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
      >
        <h3 className="text-center text-2xl">
          Escolha que tipo de carta usar para {requeriments.action}
        </h3>
        <div className="flex gap-6">
          {choosableCards.map(card =>
            <button
              key={card}
              className="hover:scale-110 cursor:pointer"
            >
              <InfluenceCard
                card={card}
                cardVersion={useRandomCardVersion()}
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
    >
      <h3 className="text-center text-2xl">Escolha qual das suas cartas usar</h3>
      <div className="flex gap-6">
        {!gameState.player.cards[0].isDead &&
          <button
            className="hover:scale-110 cursor-pointer"
          >
            <InfluenceCard
              card={gameState.player.cards[0].card}
              cardVersion={firstVariant as CardVersion}
            />
          </button>
        }
        {!gameState.player.cards[1].isDead &&
          <button
            className="hover:scale-110 cursor-pointer"
          >
            <InfluenceCard
              card={gameState.player.cards[1].card}
              cardVersion={secondVariant as CardVersion}

            />
          </button>
        }
      </div>
    </div>
  )

  if (type === MenuTypes.CARD_PICKING_CHANGE) children = (
    <div
      className="flex flex-col gap-4 items-center"
    >
      <h3 className="text-center text-2xl">Escolha qual das suas cartas deve ser trocada</h3>
      <div className="flex gap-6">
        <button
          className="hover:scale-110 cursor-pointer"
        >
          <InfluenceCard
            card={gameState.player.cards[0].card}
            cardVersion={firstVariant as CardVersion}
          />
        </button>
        <button
          className="hover:scale-110 cursor-pointer"
        >
          <InfluenceCard
            card={gameState.player.cards[1].card}
            cardVersion={secondVariant as CardVersion}
          />
        </button>
      </div>
    </div>
  )

  if (type === MenuTypes.DEFENSE) children = (
    <div
      className="flex flex-col gap-4 items-center"
    >
      {gameState.context.lastAction.targetCard === undefined ? 
        <h2>
          O player {gameState.context.lastAction.player + " "}
          está te atacando com {gameState.context.lastAction.action + " "}
          usando a carta {gameState.context.lastAction.cardType + " "}
        </h2>
        :
        <h2>
          O player {gameState.context.lastAction.player + " "}
          está atacando a sua {gameState.context.lastAction.targetCard + " "}
          com {gameState.context.lastAction.action + " "}
          usando a carta {gameState.context.lastAction.cardType + " "}
        </h2>
      }
      <h3 className="text-center text-2xl">Escolha a próxima ação</h3>
      <div className="flex gap-6">
        <button
          className={optionStyles}
        >
          <h4>Bloquear</h4>
        </button>
        <button
          className={optionStyles}
        >
          <h4>Contestar</h4>
        </button>
        <button
          className={optionStyles}
        >
          <h4>Aceitar</h4>
        </button>
      </div>
    </div>
  )

  if (type === MenuTypes.INVESTIGATING) children = (
    <div
      className="flex flex-col flex-wrap gap-4 items-center justify-center"
    >
      <span>
        <InfluenceCard
          card={gameState.context.investigation!.targetCardType}
          cardVersion={investigationVariant as CardVersion}
        />
      </span>
      <h3 className="text-center text-2xl">Escolha a próxima ação</h3>
      <div className="flex gap-4 items-center">
        <button
          className={optionStyles}
        >
          <h4>Trocar</h4>
        </button>
        <button
          className={optionStyles}
        >
          <h4>Manter</h4>
        </button>
      </div>
    </div>
  )

  return (
    <div
      className="w-full h-full flex items-center justify-center absolute bg-black/70 z-10"
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