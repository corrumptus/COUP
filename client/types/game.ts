import Config from "@types/config";

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

export enum PlayerState {
    WAITING_TURN = "waitingTurn",
    THINKING = "thinking",
    WAITING_REPLY = "waitingReply",
    BEING_ATTACKED = "beingAttacked",
    INVESTIGATING = "investigating",
    BEING_BLOCKED = "beingBlocked",
    NEED_TO_GOLPE_ESTADO = "needToGolpeEstado"
}

export type Player = {
    name: string,
    cards: { card: Card | undefined, isDead: boolean }[],
    money: number,
    religion?: Religion,
    state: PlayerState
}

export type EnemyPlayer = Omit<Player, "state">;

export enum ContextType {
    INVESTIGATING,
    BEING_ATTACKED,
    OBSERVING
}

export type GameState = {
    player: Player,
    game: {
        players: EnemyPlayer[],
        currentPlayer: string,
        asylum: number,
        configs: Config
    },
    context: {
        type: ContextType.INVESTIGATING,
        card: Card,
        target: string,
        investigatedCard: Card,
        targetCard: number
    } | {
        type: ContextType.BEING_ATTACKED,
        attacker: string,
        action: Action,
        card: Card,
        attackedCard?: number,
        previousAction?: Action,
        preBlockAction?: Action
    } | {
        type: ContextType.OBSERVING,
        attacker: string,
        action?: Action,
        card?: Card,
        target?: string,
        attackedCard?: number,
        isInvestigating: boolean
    }
}