type Carta = {
    taxar: boolean,
    extorquir: boolean,
    assassinar: boolean,
    trocar: boolean,
    investigar: boolean,
    quantidadeTaxar: number,
    quantidadeExtorquir: number,
    quantidadeTrocar: number,
    bloquearTaxar: boolean,
    bloquearExtorquir: boolean,
    bloquearAssassinar: boolean,
    bloquearTrocar: boolean,
    bloquearInvestigar: boolean
}

type Config = {
    quantidadeMoedasIniciais: number,
    renda: number,
    ajudaExterna: number,
    quantidadeMinimaGolpeEstado: number,
    quantidadeMaximaGolpeEstado: number,
    religiao: boolean,
    quantidadeTrocarPropriaReligiao: number,
    quantidadeTrocarReligiaoOutroJogador: number,
    deveresMesmaReligiao: {
        golpeEstado: boolean,
        assassinar: boolean,
        extorquir: boolean,
        taxar: boolean
    },
    tiposCartas: {
        duque: Carta,
        capitao: Carta,
        assassino: Carta,
        condessa: Carta,
        embaixador: Carta,
        inquisidor: Carta
    },
    precoAssassinato: number
}

export default Config;