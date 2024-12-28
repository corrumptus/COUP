import { PlayPageState } from "@type/gameUI";
import { useState } from "react";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";
import { GameState } from "@type/game";
import LobbyState from "@type/lobby";

export default function usePlayPageState() {
    const [ viewState, setViewState ] = useState<LobbyState | GameState>({
        player: {
            name: "name"
        },
        lobby: {
            id: -1,
            players: [],
            owner: "owner",
            configs: COUPDefaultConfigs,
            password: undefined
        }
    });

    return {
        pageState: "lobby" in viewState ? PlayPageState.LOBBY : PlayPageState.GAME,
        viewState: viewState,
        setViewState: setViewState
    }
}