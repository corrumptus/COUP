"use client";

import { useState } from "react";
import { Action, Card, GameState } from "@pages/GameView";
import { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";
import { Config } from "@utils/socketAPI";

export type ChangeRequest = ActionRequeriments & { goTo?: MenuTypes };

export default function useUIChanger() {
    const [
        [ menuType, requeriments ],
        setMenuTypeAndRequeriments
    ] = useState<[MenuTypes, ActionRequeriments]>([MenuTypes.CLOSED, {}]);

    return [
        menuType,
        requeriments,
        (gameState: GameState, newRequeriments: ChangeRequest) => {
            setMenuTypeAndRequeriments(
                performUIChange(gameState, menuType, requeriments, newRequeriments)
            );
        }
    ] as const;
}

function performUIChange(
    gameState: GameState,
    menuType: MenuTypes,
    requeriments: ActionRequeriments,
    request: ChangeRequest
): [MenuTypes, ActionRequeriments] {
    const { goTo, ...requerimentsOfRequest } = request;

    const newRequeriments = { ...requeriments, ...requerimentsOfRequest };

    if (goTo === MenuTypes.CLOSED)
        return [ goTo, {} ];

    if (newRequeriments.action === Action.RENDA) {
        //todo: socket.emit("renda");
        return [ MenuTypes.CLOSED, {} ];
    }

    if (newRequeriments.action === Action.AJUDA_EXTERNA) {
        //todo: socket.emit("ajudaExterna");
        return [ MenuTypes.CLOSED, {} ];
    }

    if (newRequeriments.action === Action.TAXAR && menuType === MenuTypes.CARD_PICKING) {
        // todo: socket.emit(
        //     "taxar",
        //     newRequeriments.choosedCardType as Card,
        //     newRequeriments.choosedSelfCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (newRequeriments.action === Action.CORRUPCAO && menuType === MenuTypes.CARD_PICKING) {
        // todo: socket.emit(
        //     "corrupcao",
        //     newRequeriments.choosedCardType as Card,
        //     newRequeriments.choosedSelfCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (newRequeriments.action === Action.EXTORQUIR && menuType === MenuTypes.CARD_PICKING) {
        // todo: socket.emit(
        //     "extorquir",
        //     newRequeriments.choosedCardType as Card,
        //     newRequeriments.choosedSelfCard as number,
        //     newRequeriments.target as string
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (newRequeriments.action === Action.GOLPE_ESTADO) {
        // todo: socket.emit(
        //     "golpeEstado",
        //     newRequeriments.target as string,
        //     newRequeriments.choosedTargetCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }
    
    if (newRequeriments.action === Action.ASSASSINAR && menuType === MenuTypes.CARD_PICKING) {
        // todo: socket.emit(
        //     "assassinar",
        //     newRequeriments.choosedCardType as Card,
        //     newRequeriments.target as string,
        //     newRequeriments.choosedSelfCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (newRequeriments.action === Action.INVESTIGAR && menuType === MenuTypes.CARD_PICKING) {
        // todo: socket.emit(
        //     "investigar",
        //     newRequeriments.choosedCardType as Card,
        //     newRequeriments.choosedSelfCard as number,
        //     newRequeriments.target as string,
        //     newRequeriments.choosedTargetCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (
        newRequeriments.action === Action.TROCAR &&
        menuType === MenuTypes.CARD_PICKING &&
        quantidadeTrocar(gameState.game.configs, newRequeriments.choosedCardType as Card) === 2
    ) {
        // todo: socket.emit(
        //     "trocar",
        //     newRequeriments.choosedCardType as Card,
        //     newRequeriments.choosedSelfCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (
        newRequeriments.action === Action.TROCAR &&
        menuType === MenuTypes.CARD_PICKING_CHANGE &&
        quantidadeTrocar(gameState.game.configs, newRequeriments.choosedCardType as Card) === 1
    ) {
        // todo: socket.emit(
        //     "trocar",
        //     newRequeriments.choosedCardType as Card,
        //     newRequeriments.choosedSelfCard as number,
        //     newRequeriments.choosedTargetCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (newRequeriments.action === Action.TROCAR_PROPRIA_RELIGIAO) {
        // todo: socket.emit("trocarPropriaReligiao");
        return [ MenuTypes.CLOSED, {} ];
    }

    if (newRequeriments.action === Action.TROCAR_RELIGIAO_OUTRO) {
        // todo: socket.emit("trocarReligiaoOutro", newRequeriments.target as string);
        return [ MenuTypes.CLOSED, {} ];
    }

    if (goTo !== undefined)
        return [ goTo, newRequeriments ];

    let newGoTo: MenuTypes = MenuTypes.CLOSED;

    if (newRequeriments.action === Action.TAXAR && menuType === MenuTypes.MONEY)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (newRequeriments.action === Action.TAXAR && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;


    if (newRequeriments.action === Action.CORRUPCAO && menuType === MenuTypes.MONEY)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (newRequeriments.action === Action.CORRUPCAO && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;


    if (newRequeriments.action === Action.EXTORQUIR && menuType === MenuTypes.CLOSED)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (newRequeriments.action === Action.EXTORQUIR && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;


    if (newRequeriments.action === Action.ASSASSINAR && menuType === MenuTypes.ATTACK)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (newRequeriments.action === Action.ASSASSINAR && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;


    if (newRequeriments.action === Action.INVESTIGAR && menuType === MenuTypes.ATTACK)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (newRequeriments.action === Action.INVESTIGAR && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;


    if (newRequeriments.action === Action.TROCAR && menuType === MenuTypes.CLOSED)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (newRequeriments.action === Action.TROCAR && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;
    if (newRequeriments.action === Action.TROCAR && menuType === MenuTypes.CARD_PICKING)
        newGoTo = MenuTypes.CARD_PICKING_CHANGE;

    return [ newGoTo, newRequeriments ];
}

function quantidadeTrocar(configs: Config, card: Card) {
    return configs.tiposCartas[card as keyof typeof configs.tiposCartas].quantidadeTrocar;
}