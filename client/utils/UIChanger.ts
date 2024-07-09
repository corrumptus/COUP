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

    if (goTo === MenuTypes.CLOSED)
        return [ goTo, {} ];

    if (requerimentsOfRequest.action === Action.RENDA) {
        //todo: socket.emit("renda");
        return [ MenuTypes.CLOSED, {} ];
    }

    if (requerimentsOfRequest.action === Action.AJUDA_EXTERNA) {
        //todo: socket.emit("ajudaExterna");
        return [ MenuTypes.CLOSED, {} ];
    }

    if (requerimentsOfRequest.action === Action.TAXAR && menuType === MenuTypes.CARD_PICKING) {
        // todo: socket.emit(
        //     "taxar",
        //     requeriments.choosedCardType as Card,
        //     requeriments.choosedSelfCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (requerimentsOfRequest.action === Action.CORRUPCAO && menuType === MenuTypes.CARD_PICKING) {
        // todo: socket.emit(
        //     "corrupcao",
        //     requeriments.choosedCardType as Card,
        //     requeriments.choosedSelfCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (requerimentsOfRequest.action === Action.EXTORQUIR && menuType === MenuTypes.CARD_CHOOSER) {
        // todo: socket.emit(
        //     "extorquir",
        //     requeriments.choosedCardType as Card,
        //     requeriments.choosedSelfCard as number,
        //     requeriments.target as string
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (requeriments.action === Action.GOLPE_ESTADO) {
        // todo: socket.emit(
        //     "golpeEstado",
        //     requeriments.target as string,
        //     requeriments.choosedTargetCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }
    
    if (requerimentsOfRequest.action === Action.ASSASSINAR && menuType === MenuTypes.CARD_PICKING) {
        // todo: socket.emit(
        //     "assassinar",
        //     requeriments.choosedCardType as Card,
        //     requeriments.target as string,
        //     requeriments.choosedSelfCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (requerimentsOfRequest.action === Action.INVESTIGAR && menuType === MenuTypes.CARD_PICKING) {
        // todo: socket.emit(
        //     "investigar",
        //     requeriments.choosedCardType as Card,
        //     requeriments.choosedSelfCard as number,
        //     requeriments.target as string,
        //     requeriments.choosedTargetCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (
        requerimentsOfRequest.action === Action.TROCAR &&
        quantidadeTrocar(gameState.game.configs, requerimentsOfRequest.choosedCardType as Card) === 2 &&
        menuType === MenuTypes.CARD_PICKING
    ) {
        // todo: socket.emit(
        //     "trocar",
        //     requeriments.choosedCardType as Card,
        //     requeriments.choosedSelfCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (
        requerimentsOfRequest.action === Action.TROCAR &&
        quantidadeTrocar(gameState.game.configs, requerimentsOfRequest.choosedCardType as Card) === 1 &&
        menuType === MenuTypes.CARD_PICKING_CHANGE
    ) {
        // todo: socket.emit(
        //     "trocar",
        //     requeriments.choosedCardType as Card,
        //     requeriments.choosedSelfCard as number,
        //     requeriments.choosedTargetCard as number
        // );
        return [ MenuTypes.CLOSED, {} ];
    }

    if (requerimentsOfRequest.action === Action.TROCAR_PROPRIA_RELIGIAO) {
        // todo: socket.emit("trocarPropriaReligiao");
        return [ MenuTypes.CLOSED, {} ];
    }

    if (requerimentsOfRequest.action === Action.TROCAR_RELIGIAO_OUTRO) {
        // todo: socket.emit("trocarReligiaoOutro", requeriments.target as string);
        return [ MenuTypes.CLOSED, {} ];
    }

    const newRequeriments = { ...requeriments, ...requerimentsOfRequest };

    if (goTo !== undefined)
        return [ goTo, newRequeriments ];

    let newGoTo: MenuTypes = MenuTypes.CLOSED;

    if (requerimentsOfRequest.action === Action.TAXAR && menuType === MenuTypes.MONEY)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (requerimentsOfRequest.action === Action.TAXAR && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;


    if (requerimentsOfRequest.action === Action.CORRUPCAO && menuType === MenuTypes.MONEY)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (requerimentsOfRequest.action === Action.CORRUPCAO && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;


    if (requerimentsOfRequest.action === Action.EXTORQUIR && menuType === MenuTypes.CLOSED)
        newGoTo = MenuTypes.CARD_CHOOSER;


    if (requerimentsOfRequest.action === Action.ASSASSINAR && menuType === MenuTypes.ATTACK)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (requerimentsOfRequest.action === Action.ASSASSINAR && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;


    if (requerimentsOfRequest.action === Action.INVESTIGAR && menuType === MenuTypes.ATTACK)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (requerimentsOfRequest.action === Action.INVESTIGAR && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;


    if (requerimentsOfRequest.action === Action.TROCAR && menuType === MenuTypes.CLOSED)
        newGoTo = MenuTypes.CARD_CHOOSER;
    if (requerimentsOfRequest.action === Action.TROCAR && menuType === MenuTypes.CARD_CHOOSER)
        newGoTo = MenuTypes.CARD_PICKING;
    if (requerimentsOfRequest.action === Action.TROCAR && menuType === MenuTypes.CARD_PICKING)
        newGoTo = MenuTypes.CARD_PICKING_CHANGE;

    return [ newGoTo, newRequeriments ];
}

function quantidadeTrocar(configs: Config, card: Card) {
    return configs.tiposCartas[card as keyof typeof configs.tiposCartas].quantidadeTrocarPropria;
}