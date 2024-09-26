import { Action, GameState } from "@pages/GameView";
import { COUPSocket } from "@utils/socketAPI";
import useUIChanger from "@utils/UIChanger";

function ContextNotification({
  socket,
  gameState,
  message,
  blockable,
  contestable
}: {
  socket: COUPSocket,
  gameState: GameState,
  message: string,
  blockable: boolean,
  contestable: boolean
}) {
  const [ , , changeUI ] = useUIChanger();

  return (
    <div>
      {message}
      <div className="flex gap-3">
        {blockable &&
          <button
            className="bg-red-400 p-1 rounded-lg border-zinc-900 border-2 hover:shadow hover:shadow-gray-400"
            onClick={e => {
              e.stopPropagation();

              changeUI(socket, gameState, { "action": Action.BLOQUEAR })
            }}
          >
            Bloquear
          </button>
        }
        {contestable &&
          <button
            className="bg-orange-400 p-1 rounded-lg border-zinc-900 border-2 hover:shadow hover:shadow-gray-400"
            onClick={e => {
              e.stopPropagation();

              changeUI(socket, gameState, { "action": Action.CONTESTAR })
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
  socket: COUPSocket,
  gameState: GameState,
  message: string,
  blockable: boolean,
  contestable: boolean
) {
  return <ContextNotification
    socket={socket}
    gameState={gameState}
    message={message}
    blockable={blockable}
    contestable={contestable}
  />
}