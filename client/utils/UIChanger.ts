"use client";

import { useState } from "react";
import { Action, Card, GameState, Player } from "@pages/GameView";
import { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";
import { Config } from "@utils/socketAPI";
import { getChoosableCards } from "@utils/utils";
import { newToaster } from "./Toasters";

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
    const requestProblems = getRequestProblems(gameState, request);

    if (requestProblems !== undefined) {
        newToaster(requestProblems);
        return [ menuType, requeriments ];
    }

    const { goTo, ...requerimentsOfRequest } = request;

    const newRequeriments = { ...requeriments, ...requerimentsOfRequest };

    if (goTo === MenuTypes.CLOSED)
        return [ MenuTypes.CLOSED, {} ];

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

    const choosableCards = getChoosableCards(gameState.game.configs, newRequeriments);

    if (choosableCards.length === 1) {
        newRequeriments.choosedCardType = choosableCards[0];
        return [ MenuTypes.CARD_PICKING, newRequeriments ];
    }

    return [ getNextGoTo(newRequeriments.action as Action, menuType), newRequeriments ];
}

function getNextGoTo(action: Action, menuType: MenuTypes) {
    if (action === Action.TAXAR && menuType === MenuTypes.MONEY)
        return MenuTypes.CARD_CHOOSER;
    if (action === Action.TAXAR && menuType === MenuTypes.CARD_CHOOSER)
        return MenuTypes.CARD_PICKING;


    if (action === Action.CORRUPCAO && menuType === MenuTypes.MONEY)
        return MenuTypes.CARD_CHOOSER;
    if (action === Action.CORRUPCAO && menuType === MenuTypes.CARD_CHOOSER)
        return MenuTypes.CARD_PICKING;


    if (action === Action.EXTORQUIR && menuType === MenuTypes.CLOSED)
        return MenuTypes.CARD_CHOOSER;
    if (action === Action.EXTORQUIR && menuType === MenuTypes.CARD_CHOOSER)
        return MenuTypes.CARD_PICKING;


    if (action === Action.ASSASSINAR && menuType === MenuTypes.ATTACK)
        return MenuTypes.CARD_CHOOSER;
    if (action === Action.ASSASSINAR && menuType === MenuTypes.CARD_CHOOSER)
        return MenuTypes.CARD_PICKING;


    if (action === Action.INVESTIGAR && menuType === MenuTypes.ATTACK)
        return MenuTypes.CARD_CHOOSER;
    if (action === Action.INVESTIGAR && menuType === MenuTypes.CARD_CHOOSER)
        return MenuTypes.CARD_PICKING;


    if (action === Action.TROCAR && menuType === MenuTypes.CLOSED)
        return MenuTypes.CARD_CHOOSER;
    if (action === Action.TROCAR && menuType === MenuTypes.CARD_CHOOSER)
        return MenuTypes.CARD_PICKING;
    if (action === Action.TROCAR && menuType === MenuTypes.CARD_PICKING)
        return MenuTypes.CARD_PICKING_CHANGE;

    return MenuTypes.CLOSED;
}

function quantidadeTrocar(configs: Config, card: Card) {
    return configs.tiposCartas[card as keyof typeof configs.tiposCartas].quantidadeTrocar;
}

function getRequestProblems(gameState: GameState, request: ChangeRequest): string | undefined {
    if (
        request.choosedSelfCard !== undefined
        &&
        gameState.player.cards[request.choosedSelfCard].isDead
    )
        return "A carta escolhida está morta";

    if (
        request.target !== undefined
        &&
        request.choosedTargetCard !== undefined
        &&
        (gameState.game.players
            .find(p => p.name === request.target) as Omit<Player, "state">)
            .cards[request.choosedTargetCard].isDead
    )
        return "A carta escolhida está morta";

    if (
        gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado
        &&
        gameState.game.currentPlayer === gameState.player.name
        &&
        request.goTo !== MenuTypes.ATTACK
    )
        return "Você só pode dar golpe de estado neste turno";

    if (
        gameState.player.money >= gameState.game.configs.quantidadeMaximaGolpeEstado
        &&
        gameState.game.currentPlayer === gameState.player.name
        &&
        (
            request.goTo !== MenuTypes.ATTACK
            ||
            (
                request.goTo === undefined
                &&
                request.action !== Action.GOLPE_ESTADO
            )
        )
    )
        return "Você só pode dar golpe de estado neste turno";

    if (
        request.choosedCardType !== undefined
        &&
        request.action === Action.ASSASSINAR
        &&
        gameState.player.money <
            gameState.game.configs.tiposCartas[
                request.choosedCardType as keyof typeof
                gameState.game.configs.tiposCartas
            ].quantidadeAssassinar
    )
        return "Você não pode assassinar pois não possui dinheiro suficiente";

    if (
        request.action === Action.CORRUPCAO
        &&
        gameState.game.asylum === 0
    )
        return "O asilo não possui moedas";

    if (
        request.action === Action.TROCAR_PROPRIA_RELIGIAO
        &&
        gameState.player.money < gameState.game.configs.religiao.quantidadeTrocarPropria
    )
        return "Você não tem dinheiro suficiente para trocar de religião";

    if (
        request.action === Action.TROCAR_RELIGIAO_OUTRO
        &&
        gameState.player.money < gameState.game.configs.religiao.quantidadeTrocarOutro
    )
        return "Você não tem dinheiro suficiente para trocar a religião de outro jogador";

    return undefined;
}