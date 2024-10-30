type Carta = {
    taxar: boolean,
    extorquir: boolean,
    assassinar: boolean,
    trocar: boolean,
    investigar: boolean,
    quantidadeTaxar: number,
    quantidadeExtorquir: number,
    quantidadeAssassinar: number,
    quantidadeTrocar: number,
    bloquearTaxar: boolean,
    bloquearExtorquir: boolean,
    bloquearAssassinar: boolean,
    bloquearTrocar: boolean,
    bloquearInvestigar: boolean
}
  
type Config = {
    moedasIniciais: number,
    renda: number,
    ajudaExterna: number,
    quantidadeMinimaGolpeEstado: number,
    quantidadeMaximaGolpeEstado: number,
    religiao: {
        reforma: boolean,
        quantidadeTrocarPropria: number,
        quantidadeTrocarOutro: number,
        deveres: {
            golpeEstado: boolean,
            assassinar: boolean,
            extorquir: boolean,
            taxar: boolean
        },
        cartasParaCorrupcao: {
            duque: boolean,
            capitao: boolean,
            assassino: boolean,
            condessa: boolean,
            embaixador: boolean,
            inquisidor: boolean
        }
    },
    tiposCartas: {
        duque: Carta,
        capitao: Carta,
        assassino: Carta,
        condessa: Carta,
        embaixador: Carta,
        inquisidor: Carta
    }
}

export default Config;