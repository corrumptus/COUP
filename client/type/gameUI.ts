import type { Action, Card } from "@type/game";

export type CardVersion = 0 | 1 | 2;

export enum PlayPageState {
  LOBBY,
  GAME
}

export enum MenuTypes {
    CLOSED,
    MONEY,
    ATTACK,
    CARD_CHOOSER,
    CARD_PICKING,
    CARD_PICKING_CHANGE,
    INVESTIGATING,
    DEFENSE,
    BLOCK_DEFENSE
}

export type ActionRequeriments = {
    action?: Action,
    cardType?: Card,
    selfCard?: number,
    target?: string,
    targetCard?: number
}

export type ChangeRequest = {
    goTo?: MenuTypes
} & ActionRequeriments;