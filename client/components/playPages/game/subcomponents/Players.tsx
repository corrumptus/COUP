import { useState } from "react";
import { Player } from "@pages/GameView";
import PlayerCard from "@components/PlayerCard";
import { ChangeRequest } from "@utils/UIChanger";

export default function Players({
  players,
  performChange
}: {
  players: Omit<Player, "state">[],
  performChange: (changeRequest: ChangeRequest) => void
}) {
  const [ isMouseDown, setIsMouseDown ] = useState(false);
  const [ startX, setStartX ] = useState(0);
  const [ scrollLeft, setScrollLeft ] = useState(0);

  return (
    <div
      className="h-full flex items-center gap-4 overflow-auto game_scrollbar"
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
          performChange={performChange}
        />
      )}
    </div>
  )
}