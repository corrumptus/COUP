import { useState } from "react";
import { Action, Player } from "@pages/GameView";
import { MenuTypes } from "@components/GameActionMenu";
import PlayerCard from "@components/PlayerCard";

export default function Players({
  players,
  setAction,
  setMenuType,
  setRequeriments
}: {
  players: Player[],
  setAction: (action: Action) => void,
  setMenuType: (menuType: MenuTypes | undefined) => void,
  setRequeriments: (requeriment: {[key: string]: any;}) => void
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
        setStartX(e.pageX - -e.currentTarget.offsetLeft);
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
          setAction={setAction}
          setMenuType={setMenuType}
          setRequeriments={setRequeriments}
        />
      )}
    </div>
  )
}