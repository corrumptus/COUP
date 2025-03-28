import { useState } from "react";
import PlayerCard from "@components/game/PlayerCard";
import type { EnemyPlayer } from "@type/game";
import type { CardVersion, ChangeRequest } from "@type/gameUI";

export default function Players({
  players,
  playersCardVersions,
  performChange
}: {
  players: EnemyPlayer[],
  playersCardVersions: { [n in EnemyPlayer["name"]]: [CardVersion, CardVersion] },
  performChange: (changeRequest: ChangeRequest) => void
}) {
  const [ isMouseDown, setIsMouseDown ] = useState(false);
  const [ startX, setStartX ] = useState(0);
  const [ scrollLeft, setScrollLeft ] = useState(0);

  return (
    <div
      className="h-full flex items-center gap-4 overflow-auto game_scrollbar"
      id="gameView-players"
      data-testid="gameView-players"
      onMouseLeave={() => setIsMouseDown(false)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseDown={e => {
        setIsMouseDown(true);
        setStartX(e.pageX + e.currentTarget.offsetLeft);
        setScrollLeft(e.currentTarget.scrollLeft);
      }}
      onMouseMove={e => {
        if (!isMouseDown) return;

        e.preventDefault();

        const x = e.pageX - e.currentTarget.offsetLeft;
        const walk = (x-startX)*2;

        e.currentTarget.scrollLeft = scrollLeft - walk;
      }}
    >
      {players.map(p =>
        <PlayerCard
          key={p.name}
          player={p}
          playerCardVersions={playersCardVersions[p.name]}
          performChange={performChange}
        />
      )}
    </div>
  )
}