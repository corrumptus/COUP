import type Config from "@type/config";

export enum Religion {
    PROTESTANTE = "PROTESTANTE",
    CATOLICA = "CATOLICA"
}

export enum Card {
    DUQUE = "duque",
    CAPITAO = "capitao",
    ASSASSINO = "assassino",
    CONDESSA = "condessa",
    EMBAIXADOR = "embaixador",
    INQUISIDOR = "inquisidor"
}

export enum Action {
    RENDA = "renda",
    AJUDA_EXTERNA = "ajudaExterna",
    GOLPE_ESTADO = "golpeEstado",
    TAXAR = "taxar",
    ASSASSINAR = "assassinar",
    EXTORQUIR = "extorquir",
    TROCAR = "trocar",
    INVESTIGAR = "investigar",
    TROCAR_PROPRIA_RELIGIAO = "trocarPropriaReligiao",
    TROCAR_RELIGIAO_OUTRO = "trocarReligiaoOutro",
    CORRUPCAO = "corrupcao",
    CONTESTAR = "contestar",
    BLOQUEAR = "bloquear",
    CONTINUAR = "continuar"
}

type PlayerBase = {
    name: string,
    money: number,
    religion?: Religion
}

export type SelfPlayer = {
    cards: { card: Card, isDead: boolean }[],
} & PlayerBase;

export type EnemyPlayer = {
    cards: { card: Card | undefined, isDead: boolean }[]
} & PlayerBase;

export enum ContextType {
    INVESTIGATING,
    BEING_ATTACKED,
    OBSERVING
}

export type GameState = {
    player: SelfPlayer,
    game: {
        players: EnemyPlayer[],
        currentPlayer: string,
        asylum: number,
        configs: Config
    },
    context: {
        type: ContextType.INVESTIGATING,
        card: Card,
        selfCard: number,
        target: string,
        investigatedCard: Card,
        targetCard: number
    } | {
        type: ContextType.BEING_ATTACKED,
        attacker: string,
        action: Action,
        card: Card,
        attackedCard?: number,
        previousAction?: Action
    } | {
        type: ContextType.OBSERVING,
        attacker: string,
        action?: Action,
        card?: Card,
        target?: string,
        attackedCard?: number,
        isInvestigating: boolean,
        winContesting: boolean
    }
}