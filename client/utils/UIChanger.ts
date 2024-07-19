"use client";

import { useState } from "react";
import { Action, Card, ContextType, GameState, Player } from "@pages/GameView";
import { ActionRequeriments, MenuTypes } from "@components/GameActionMenu";
import { Config, COUPSocket } from "@utils/socketAPI";
import { getChoosableCards } from "@utils/utils";
import { newToaster } from "@utils/Toasters";

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
    if (Object.keys(request).length === 0) {
        if (gameState.context.type === ContextType.BEING_ATTACKED) {
            if (gameState.context.action === Action.BLOQUEAR)
                return [ MenuTypes.BLOCK_DEFENSE, requeriments ];

            return [ MenuTypes.DEFENSE, requeriments ];
        }

        if (gameState.context.type === ContextType.OBSERVING)
            newToaster(contextToNotification(gameState.context));

        return [ menuType, requeriments ];
    }

    const requestProblems = getRequestProblems(gameState, request, requeriments);

    if (requestProblems !== undefined) {
        newToaster(requestProblems);
        return [ menuType, requeriments ];
    }

    const { goTo, ...requerimentsOfRequest } = request;

    const newRequeriments = { ...requeriments, ...requerimentsOfRequest };

    if (goTo === MenuTypes.CLOSED)
        return [ MenuTypes.CLOSED, {} ];

    if (isActionEmitable(gameState.game.configs, newRequeriments, menuType)) {
        emitAction(
            // socket,
            gameState.game.configs,
            newRequeriments
        );

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

function contextToNotification(context: GameState["context"]): string {
    if (context.type !== ContextType.OBSERVING)
        return "";

    if (context.action === Action.TROCAR_PROPRIA_RELIGIAO)
        return `O player ${context.attacker} trocou a própria religião`;

    if (context.action === Action.TROCAR_RELIGIAO_OUTRO)
        return `O player ${context.attacker} trocou a religião de ${context.target}`;

    if (context.action === Action.RENDA)
        return `O player ${context.attacker} pediu renda`;

    if (context.action === Action.AJUDA_EXTERNA)
        return `O player ${context.attacker} pediu ajuda externa`;

    if (context.action === Action.TAXAR)
        return `O player ${context.attacker} taxou o banco`;

    if (context.action === Action.CORRUPCAO)
        return `O player ${context.attacker} se corrompeu`;

    if (context.action === Action.EXTORQUIR)
        return `O player ${context.attacker} extorquiu ${context.target} com ${context.card}`;

    if (context.action === Action.ASSASSINAR)
        return `O player ${context.attacker} assassinou uma carta de ${context.target} com ${context.card}`;

    if (context.action === Action.INVESTIGAR)
        return `O player ${context.attacker} quer ver uma carta de ${context.target} com ${context.card}`;

    if (context.action === Action.GOLPE_ESTADO)
        return `O player ${context.attacker} deu um golpe de estado em ${context.target}`;

    if (context.action === Action.TROCAR && !context.isInvesting)
        return context.attackedCard !== undefined ?
            `O player ${context.attacker} trocou a ${context.attackedCard + 1}º carta com ${context.card}`
            :
            `O player ${context.attacker} trocou as cartas com ${context.card}`;

    if (context.action === Action.TROCAR && context.isInvesting)
        return `O player ${context.attacker} trocou a ${context.attackedCard as number + 1}º carta de ${context.target}`;

    if (context.action === Action.CONTESTAR)
        return `O player ${context.attacker} contestou ${context.target}`;

    if (context.action === Action.BLOQUEAR)
        return `O player ${context.attacker} bloqueou ${context.target}`;

    return "";
}

function getRequestProblems(
    gameState: GameState,
    request: ChangeRequest,
    curRequeriments: ActionRequeriments
): string | undefined {
    if (
        request.target !== undefined
        &&
        (gameState.game.players
            .find(p => p.name === request.target) as Omit<Player, "state">
        ).cards
            .filter(c => !c.isDead)
            .length === 0
    )
        return "O player escolhido já está morto";

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

    if (
        request.target !== undefined
        &&
        request.action === Action.EXTORQUIR
        &&
        getChoosableCards(gameState.game.configs, request).length === 1
        &&
        (gameState.game.players
            .find(p => p.name === request.target) as Omit<Player, "state">
        ).money <
        gameState.game.configs.tiposCartas[
            getChoosableCards(gameState.game.configs, request)[0] as
            keyof typeof gameState.game.configs.tiposCartas
        ].quantidadeExtorquir
    )
        return "Este player não tem dinheiro suficiente para ser extorquido";

    if (
        curRequeriments.target !== undefined
        &&
        curRequeriments.action === Action.EXTORQUIR
        &&
        request.choosedCardType !== undefined
        &&
        (gameState.game.players
            .find(p => p.name === curRequeriments.target) as Omit<Player, "state">)
        .money <
        gameState.game.configs.tiposCartas[
            request.choosedCardType as
            keyof typeof gameState.game.configs.tiposCartas
        ]
        .quantidadeExtorquir
    )
        return "Este player não tem dinheiro suficiente para ser extorquido";

    return undefined;
}

function isActionEmitable(
    configs: Config,
    requeriments: ActionRequeriments,
    menuType: MenuTypes
): boolean {
    if (requeriments.action === Action.RENDA)
        return true;

    if (requeriments.action === Action.AJUDA_EXTERNA)
        return true;

    if (requeriments.action === Action.TAXAR && menuType === MenuTypes.CARD_PICKING)
        return true;

    if (requeriments.action === Action.CORRUPCAO && menuType === MenuTypes.CARD_PICKING)
        return true;

    if (requeriments.action === Action.EXTORQUIR && menuType === MenuTypes.CARD_PICKING)
        return true;

    if (requeriments.action === Action.GOLPE_ESTADO)
        return true;

    if (requeriments.action === Action.ASSASSINAR && menuType === MenuTypes.CARD_PICKING)
        return true;

    if (requeriments.action === Action.INVESTIGAR && menuType === MenuTypes.CARD_PICKING)
        return true;

    if (
        requeriments.action === Action.TROCAR
        &&
        menuType === MenuTypes.INVESTIGATING
    )
        return true;

    if (
        requeriments.action === Action.TROCAR &&
        menuType === MenuTypes.CARD_PICKING &&
        quantidadeTrocar(configs, requeriments.choosedCardType as Card) === 2
    )
        return true;

    if (
        requeriments.action === Action.TROCAR &&
        menuType === MenuTypes.CARD_PICKING_CHANGE &&
        quantidadeTrocar(configs, requeriments.choosedCardType as Card) === 1
    )
        return true;

    if (requeriments.action === Action.TROCAR_PROPRIA_RELIGIAO)
        return true;

    if (requeriments.action === Action.TROCAR_RELIGIAO_OUTRO)
        return true;

    return false;
}

function emitAction(
    // socket: COUPSocket,
    configs: Config,
    requeriments: ActionRequeriments
) {
    const infos = [
        requeriments.action,
        requeriments.choosedCardType,
        requeriments.choosedSelfCard,
        requeriments.target,
        requeriments.choosedTargetCard
    ]
    .filter((info, i) => {
        if (
            i === 4 &&
            requeriments.action === Action.TROCAR &&
            configs.tiposCartas[
                requeriments.choosedCardType as keyof typeof configs.tiposCartas
            ].quantidadeTrocar === 2
        )
            return undefined;

        return info;
    })
    .filter(info => info !== undefined);

    //@ts-ignore
    // socket.emit(...infos);
}