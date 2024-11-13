"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { getChoosableCards } from "@utils/utils";
import { newToaster } from "@utils/Toasters";
import createContextNotification from "@utils/ContextNotification";
import Config from "@type/config";
import {
    Action,
    Card,
    ContextType,
    EnemyPlayer,
    GameState
} from "@type/game";
import {
    ActionRequeriments,
    ChangeRequest,
    MenuTypes
} from "@type/gameUI";
import { COUPSocket } from "@type/socket";

export default function useUIChanger() {
    const [
        [ menuType, requeriments ],
        setMenuTypeAndRequeriments
    ] = useState<[ MenuTypes, ActionRequeriments ]>([MenuTypes.CLOSED, {}]);

    return [
        menuType,
        requeriments,
        (socket: COUPSocket, gameState: GameState, newRequeriments: ChangeRequest) =>
            setMenuTypeAndRequeriments(
                performUIChange(
                    socket,
                    gameState,
                    menuType,
                    requeriments,
                    newRequeriments,
                    performUiChangesByToaster(
                        setMenuTypeAndRequeriments,
                        socket,
                        (gameState.context as { action: Action }).action,
                        gameState.game.configs
                    )
                )
            )
    ] as const;
}

function performUiChangesByToaster(
    changeUi: Dispatch<SetStateAction<[ MenuTypes, ActionRequeriments ]>>,
    socket: COUPSocket,
    notifiedAction: Action,
    configs: Config
) {
    return (
        action: Action.BLOQUEAR | Action.CONTESTAR
    ) => {
        if (action === Action.BLOQUEAR && !blockableActionNeedsSelfCard(notifiedAction)) {
            socket.emit("bloquear");
            return;
        }

        if (action === Action.CONTESTAR && !contestableActionNeedsSelfCard(notifiedAction)) {
            socket.emit("contestar");
            return;
        }

        const choosableCards = getChoosableCards(
            action,
            configs,
            notifiedAction
        );

        if (choosableCards.length === 1) {
            changeUi([
                MenuTypes.CARD_PICKING,
                {
                    action: action,
                    cardType: choosableCards[0]
                }
            ]);

            return;
        }

        changeUi([ 
            action === Action.BLOQUEAR ? MenuTypes.CARD_CHOOSER : MenuTypes.CARD_PICKING,
            { action: action }
        ]);
    }
}

function performUIChange(
    socket: COUPSocket,
    gameState: GameState,
    menuType: MenuTypes,
    requeriments: ActionRequeriments,
    request: ChangeRequest,
    attackNotifiedAction: (action: Action.BLOQUEAR | Action.CONTESTAR) => void
): [ MenuTypes, ActionRequeriments ] {
    if (Object.keys(request).length === 0) {
        if (gameState.context.type === ContextType.INVESTIGATING)
            return [
                MenuTypes.INVESTIGATING,
                {
                    ...requeriments,
                    target: gameState.context.target,
                    targetCard: gameState.context.targetCard
                }
            ];

        if (gameState.context.type === ContextType.BEING_ATTACKED)
            return [
                gameState.context.action === Action.BLOQUEAR ?
                    MenuTypes.BLOCK_DEFENSE
                    :
                    MenuTypes.DEFENSE,
                requeriments
            ];

        if (
            gameState.context.type === ContextType.OBSERVING
            &&
            gameState.context.attacker !== gameState.player.name
            &&
            gameState.context.action !== undefined
        ) {
            newToaster(
                contextToNotification(
                    gameState.context,
                    gameState.game.configs,
                    attackNotifiedAction
                )
            );
        }

        return [ menuType, requeriments ];
    }

    const requestProblems = getRequestProblems(gameState, request, requeriments);

    if (requestProblems !== undefined) {
        newToaster(requestProblems);
        return [ menuType, requeriments ];
    }

    const cannotLeave = [MenuTypes.INVESTIGATING, MenuTypes.DEFENSE, MenuTypes.BLOCK_DEFENSE].includes(menuType);

    const { goTo, ...requerimentsOfRequest } = request;

    const newRequeriments = { ...requeriments, ...requerimentsOfRequest };

    if (goTo === MenuTypes.CLOSED && !cannotLeave)
        return [ MenuTypes.CLOSED, {} ];

    if (isActionEmitable(gameState, newRequeriments, menuType)) {
        emitAction(
            socket,
            gameState.game.configs,
            newRequeriments,
            gameState.player.name
        );

        return [ MenuTypes.CLOSED, {} ];
    }

    if (goTo !== undefined)
        return [ goTo, newRequeriments ];

    const choosableCards = getChoosableCards(
        newRequeriments.action as Action,
        gameState.game.configs,
        (gameState.context as { action?: Action }).action
    );

    if (choosableCards.length === 1) {
        newRequeriments.cardType = choosableCards[0];
        return [ MenuTypes.CARD_PICKING, newRequeriments ];
    }

    if (cannotLeave && request.goTo === MenuTypes.CLOSED)
        return [ menuType, requeriments ];

    return [ getNextGoTo(newRequeriments.action as Action, menuType), newRequeriments ];
}

function contextToNotification(
    context: GameState["context"],
    configs: Config,
    attackNotifiedAction: (action: Action.BLOQUEAR | Action.CONTESTAR) => void
): JSX.Element {
    if (context.type !== ContextType.OBSERVING)
        return createContextNotification(
            "",
            false,
            false,
            (_) => {}
        );

    let message = "";
    let blockAble = false;
    let contestable = false;

    if (context.action === Action.TROCAR_PROPRIA_RELIGIAO)
        message = `O player ${context.attacker} trocou a própria religião`;

    if (context.action === Action.TROCAR_RELIGIAO_OUTRO)
        message = `O player ${context.attacker} trocou a religião de ${context.target}`;

    if (context.action === Action.RENDA)
        message = `O player ${context.attacker} pediu renda`;

    if (context.action === Action.AJUDA_EXTERNA) {
        message = `O player ${context.attacker} pediu ajuda externa`;
        blockAble = getChoosableCards(Action.BLOQUEAR, configs, context.action).length > 0;
    }

    if (context.action === Action.TAXAR) {
        message = `O player ${context.attacker} taxou o banco com ${context.card}`;
        blockAble = getChoosableCards(Action.BLOQUEAR, configs, context.action).length > 0;
        contestable = true;
    }

    if (context.action === Action.CORRUPCAO) {
        message = `O player ${context.attacker} se corrompeu com ${context.card}`;
        contestable = true;
    }

    if (context.action === Action.EXTORQUIR) {
        message = `O player ${context.attacker} extorquiu ${context.target} com ${context.card}`;
        blockAble = getChoosableCards(Action.BLOQUEAR, configs, context.action).length > 0;
        contestable = true;
    }

    if (context.action === Action.ASSASSINAR) {
        message = `O player ${context.attacker} assassinou uma carta de ${context.target} com ${context.card}`;
        blockAble = getChoosableCards(Action.BLOQUEAR, configs, context.action).length > 0;
        contestable = true;
    }

    if (context.action === Action.INVESTIGAR) {
        message = `O player ${context.attacker} quer investigar uma carta de ${context.target} com ${context.card}`;
        blockAble = getChoosableCards(Action.BLOQUEAR, configs, context.action).length > 0;
        contestable = true;
    }

    if (context.action === Action.GOLPE_ESTADO)
        message = `O player ${context.attacker} deu um golpe de estado em ${context.target}`;

    if (
        context.action === Action.TROCAR &&
        !context.isInvestigating &&
        context.attackedCard === undefined
    ) {
        message = `O player ${context.attacker} trocou as cartas com ${context.card}`;
        blockAble = getChoosableCards(Action.BLOQUEAR, configs, context.action).length > 0;
        contestable = true;
    }

    if (
        context.action === Action.TROCAR &&
        !context.isInvestigating &&
        context.attackedCard !== undefined
    ) {
        message = `O player ${context.attacker} trocou a ${context.attackedCard + 1}º carta com ${context.card}`;
        blockAble = getChoosableCards(Action.BLOQUEAR, configs, context.action).length > 0;
        contestable = true;
    }

    if (
        context.action === Action.TROCAR &&
        context.isInvestigating &&
        context.attackedCard !== undefined
    )
        message = `O player ${context.attacker} trocou a ${context.attackedCard + 1}º carta de ${context.target}`;

    if (context.action === Action.CONTESTAR)
        message = `O player ${context.attacker} contestou ${context.target}`;

    if (context.action === Action.BLOQUEAR) {
        message = `O player ${context.attacker} bloqueou ${context.target} com ${context.card}`;
        contestable = true;
    }

    return createContextNotification(
        message,
        blockAble,
        contestable,
        attackNotifiedAction
    );
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
            .find(p => p.name === request.target) as EnemyPlayer
        ).cards
            .filter(c => !c.isDead)
            .length === 0
    )
        return "O player escolhido já está morto";

    if (
        request.selfCard !== undefined
        &&
        gameState.player.cards[request.selfCard].isDead
    )
        return "A carta escolhida está morta";

    if (
        request.target !== undefined
        &&
        request.targetCard !== undefined
        &&
        (gameState.game.players
            .find(p => p.name === request.target) as EnemyPlayer)
            .cards[request.targetCard].isDead
    )
        return "A carta escolhida está morta";

    if (
        request.action === Action.GOLPE_ESTADO
        &&
        gameState.player.money < gameState.game.configs.quantidadeMinimaGolpeEstado
    )
        return "Você não tem dinheiro suficiente para dar golpe de estado";

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
        request.cardType !== undefined
        &&
        request.action === Action.ASSASSINAR
        &&
        gameState.player.money <
            gameState.game.configs.tiposCartas[
                request.cardType as keyof typeof
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
        getChoosableCards(
            request.action as Action,
            gameState.game.configs,
            (gameState.context as { action?: Action }).action 
        ).length === 1
        &&
        (gameState.game.players
            .find(p => p.name === request.target) as EnemyPlayer
        ).money <
        gameState.game.configs.tiposCartas[
            getChoosableCards(
                request.action as Action,
                gameState.game.configs,
                (gameState.context as { action?: Action }).action 
            )[0] as
            keyof typeof gameState.game.configs.tiposCartas
        ].quantidadeExtorquir
    )
        return "Este player não tem dinheiro suficiente para ser extorquido";

    if (
        curRequeriments.target !== undefined
        &&
        curRequeriments.action === Action.EXTORQUIR
        &&
        request.cardType !== undefined
        &&
        (gameState.game.players
            .find(p => p.name === curRequeriments.target) as EnemyPlayer)
        .money <
        gameState.game.configs.tiposCartas[
            request.cardType as
            keyof typeof gameState.game.configs.tiposCartas
        ]
        .quantidadeExtorquir
    )
        return "Este player não tem dinheiro suficiente para ser extorquido";

    return undefined;
}

function isActionEmitable(
    gameState: GameState,
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

    if (requeriments.action === Action.ASSASSINAR && menuType === MenuTypes.CARD_PICKING)
        return true;

    if (requeriments.action === Action.INVESTIGAR && menuType === MenuTypes.CARD_PICKING)
        return true;

    if (requeriments.action === Action.GOLPE_ESTADO)
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
        quantidadeTrocar(gameState.game.configs, requeriments.cardType as Card) === 2
    )
        return true;

    if (
        requeriments.action === Action.TROCAR &&
        menuType === MenuTypes.CARD_PICKING_CHANGE &&
        quantidadeTrocar(gameState.game.configs, requeriments.cardType as Card) === 1
    )
        return true;

    if (requeriments.action === Action.TROCAR_PROPRIA_RELIGIAO)
        return true;

    if (requeriments.action === Action.TROCAR_RELIGIAO_OUTRO)
        return true;

    if (
        requeriments.action === Action.BLOQUEAR
        &&
        gameState.context.type === ContextType.BEING_ATTACKED
        &&
        (
            (
                !blockableActionNeedsSelfCard(gameState.context.previousAction as Action)
                &&
                menuType === MenuTypes.DEFENSE
            )
            ||
            (
                blockableActionNeedsSelfCard(gameState.context.previousAction as Action)
                &&
                menuType === MenuTypes.CARD_PICKING
            )
        )
    )
        return true;

    if (
        requeriments.action === Action.BLOQUEAR
        &&
        gameState.context.type === ContextType.OBSERVING
        &&
        (
            (
                !blockableActionNeedsSelfCard(gameState.context.action as Action)
                &&
                menuType === MenuTypes.CLOSED
            )
            ||
            (
                blockableActionNeedsSelfCard(gameState.context.action as Action)
                &&
                menuType === MenuTypes.CARD_PICKING
            )
        )
    )
        return true;

    if (
        requeriments.action === Action.CONTESTAR
        &&
        gameState.context.type === ContextType.BEING_ATTACKED
        &&
        (
            (
                !contestableActionNeedsSelfCard(
                    gameState.context.action as Action,
                    gameState.context.preBlockAction
                )
                &&
                (
                    menuType === MenuTypes.DEFENSE
                    ||
                    menuType === MenuTypes.BLOCK_DEFENSE
                )
            )
            ||
            (
                contestableActionNeedsSelfCard(
                    gameState.context.action as Action,
                    gameState.context.preBlockAction
                )
                &&
                menuType === MenuTypes.CARD_PICKING
            )
        )
    )
        return true;

    if (
        requeriments.action === Action.CONTESTAR
        &&
        gameState.context.type === ContextType.OBSERVING
        &&
        (
            (
                !contestableActionNeedsSelfCard(
                    gameState.context.action as Action
                )
                &&
                menuType === MenuTypes.CLOSED
            )
            ||
            (
                contestableActionNeedsSelfCard(
                    gameState.context.action as Action
                )
                &&
                menuType === MenuTypes.CARD_PICKING
            )
        )
    )
        return true;

    if (requeriments.action === Action.CONTINUAR)
        return true;

    return false;
}

function quantidadeTrocar(configs: Config, card: Card): number {
    return configs.tiposCartas[card as keyof typeof configs.tiposCartas].quantidadeTrocar;
}

function blockableActionNeedsSelfCard(blockableAction: Action): boolean {
    return ![Action.ASSASSINAR, Action.INVESTIGAR].includes(blockableAction);
}

function contestableActionNeedsSelfCard(action: Action, preBlockAction?: Action): boolean {
    if (action !== Action.BLOQUEAR)
        return ![Action.ASSASSINAR, Action.INVESTIGAR].includes(action);

    return preBlockAction === Action.AJUDA_EXTERNA;
}

function emitAction(
    socket: COUPSocket,
    configs: Config,
    requeriments: ActionRequeriments,
    playerName: string
) {
    const infos = [
        requeriments.action,
        requeriments.cardType,
        requeriments.selfCard,
        requeriments.target,
        requeriments.targetCard
    ]
    .map((info, i) => {
        if (
            i === 4
            &&
            requeriments.action === Action.TROCAR
            &&
            configs.tiposCartas[
                requeriments.cardType as keyof typeof configs.tiposCartas
            ].quantidadeTrocar === 2
        )
            return undefined;

        if (
            i === 3
            &&
            requeriments.action === Action.TROCAR
            &&
            requeriments.target === undefined
        )
            return playerName;

        return info;
    })
    .filter(info => info !== undefined);

    // @ts-ignore
    socket.emit(...infos);
}

function getNextGoTo(action: Action, menuType: MenuTypes): MenuTypes {
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


    if (action === Action.BLOQUEAR && menuType === MenuTypes.DEFENSE)
        return MenuTypes.CARD_CHOOSER;
    if (action === Action.BLOQUEAR && menuType === MenuTypes.CARD_CHOOSER)
        return MenuTypes.CARD_PICKING;


    if (action === Action.CONTESTAR && menuType === MenuTypes.CLOSED)
        return MenuTypes.CARD_PICKING;
    if (action === Action.CONTESTAR && menuType === MenuTypes.DEFENSE)
        return MenuTypes.CARD_PICKING;
    if (action === Action.CONTESTAR && menuType === MenuTypes.BLOCK_DEFENSE)
        return MenuTypes.CARD_PICKING;

    return MenuTypes.CLOSED;
}