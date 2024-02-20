enum Action {
    RENDA,
    AJUDA_EXTERNA,
    GOLPE_ESTADO,
    TAXAR,
    ASSASSINAR,
    EXTORQUIR,
    TROCAR,
    INVESTIGAR,
    CONTESTAR,
    BLOQUEAR
}

const postActions: { [key in Action]: Action[] } = {
    [Action.RENDA]: [],

    [Action.AJUDA_EXTERNA]: [
        Action.BLOQUEAR
    ],

    [Action.GOLPE_ESTADO]: [],

    [Action.TAXAR]: [
        Action.CONTESTAR
    ],

    [Action.ASSASSINAR]: [
        Action.CONTESTAR,
        Action.BLOQUEAR
    ],

    [Action.EXTORQUIR]: [
        Action.CONTESTAR,
        Action.BLOQUEAR
    ],

    [Action.TROCAR]: [
        Action.CONTESTAR
    ],

    [Action.INVESTIGAR]: [
        Action.TROCAR,
        Action.CONTESTAR
    ],

    [Action.CONTESTAR]: [],

    [Action.BLOQUEAR]: [
        Action.CONTESTAR
    ]
}

Object.seal(postActions);

const targetActions: Action[] = [
    Action.ASSASSINAR,
    Action.BLOQUEAR,
    Action.CONTESTAR,
    Action.EXTORQUIR,
    Action.GOLPE_ESTADO,
    Action.INVESTIGAR
]

Object.seal(targetActions);

export { postActions, targetActions };

export default Action;