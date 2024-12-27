import { useState } from "react";
import LobbyState from "@type/lobby";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";

export default function useLobbyState() {
    const state = useState<LobbyState>({
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

    return state;
}