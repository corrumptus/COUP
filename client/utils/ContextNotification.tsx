import { Action } from "@type/game";

function ContextNotification({
  message,
  blockable,
  contestable,
  attackNotifiedAction
}: {
  message: string,
  blockable: boolean,
  contestable: boolean,
  attackNotifiedAction: (action: Action.BLOQUEAR | Action.CONTESTAR) => void
}) {
  return (
    <div>
      <span
        id="gameView-gameUpdateToasterContent"
        data-testid="gameView-gameUpdateToasterContent"
      >
        {message}
      </span>
      <div className="flex gap-3">
        {blockable &&
          <button
            className="bg-red-400 p-1 rounded-lg border-zinc-900 border-2 hover:shadow hover:shadow-gray-400"
            id="gameView-gameUpdateToasterBlockButton"
            data-testid="gameView-gameUpdateToasterBlockButton"
            onClick={e => {
              e.stopPropagation();

              attackNotifiedAction(Action.BLOQUEAR);
            }}
          >
            Bloquear
          </button>
        }
        {contestable &&
          <button
            className="bg-orange-400 p-1 rounded-lg border-zinc-900 border-2 hover:shadow hover:shadow-gray-400"
            id="gameView-gameUpdateToasterContestButton"
            data-testid="gameView-gameUpdateToasterContestButton"
            onClick={e => {
              e.stopPropagation();

              attackNotifiedAction(Action.CONTESTAR);
            }}
          >
            Contestar
          </button>
        }
      </div>
    </div>
  )
}

export default function createContextNotification(
  message: string,
  blockable: boolean,
  contestable: boolean,
  attackNotifiedAction: (action: Action.BLOQUEAR | Action.CONTESTAR) => void
) {
  return <ContextNotification
    message={message}
    blockable={blockable}
    contestable={contestable}
    attackNotifiedAction={attackNotifiedAction}
  />
}