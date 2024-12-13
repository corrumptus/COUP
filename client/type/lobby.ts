import type Config from "@type/config";

type LobbyState = {
    player: {
        name: string
    },
    lobby: {
        id: number,
        players: string[],
        owner: string,
        configs: Config,
        password: string | undefined
    }
}

export type Lobby = {
    id: number,
    quantidadePlayers: number,
    aberto: boolean
}

export default LobbyState;