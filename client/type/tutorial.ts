enum TutorialType {
    INTRODUCAO = "introducao",
    ASSASSINO = "assassino",
    CAPITAO = "capitao",
    CONDESSA = "condessa",
    DUQUE = "duque",
    EMBAIXADOR = "embaixador",
    INQUISIDOR = "inquisidor",
    RENDA = "renda",
    AJUDA_EXTERNA = "ajuda_externa",
    GOLPE_ESTADO = "golpe_estado",
    ASSASSINAR = "assassinar",
    EXTORQUIR = "extorquir",
    TAXAR = "taxar",
    TROCAR = "trocar",
    INVESTIGAR = "inventigar",
    BLOQUEAR = "bloquear",
    CONTESTAR = "contestar",
    CONTINUAR = "continuar",
    RELIGIAO = "religiao",
    TROCAR_RELIGIAO = "trocar_religiao",
    CORRUPCAO = "corrupcao",
    DEVERES = "deveres"
}

export default TutorialType;

export function getTutorialType(
    tutorial: any,
    defaultTutorial: TutorialType = TutorialType.INTRODUCAO
): TutorialType {
    switch (tutorial) {
        case "introducao": return TutorialType.INTRODUCAO;
        case "assassino": return TutorialType.ASSASSINO;
        case "capitao": return TutorialType.CAPITAO;
        case "condessa": return TutorialType.CONDESSA;
        case "duque": return TutorialType.DUQUE;
        case "embaixador": return TutorialType.EMBAIXADOR;
        case "inquisidor": return TutorialType.INQUISIDOR;
        case "renda": return TutorialType.RENDA;
        case "ajuda_externa": return TutorialType.AJUDA_EXTERNA;
        case "golpe_estado": return TutorialType.GOLPE_ESTADO;
        case "assassinar": return TutorialType.ASSASSINAR;
        case "extorquir": return TutorialType.EXTORQUIR;
        case "taxar": return TutorialType.TAXAR;
        case "trocar": return TutorialType.TROCAR;
        case "inventigar": return TutorialType.INVESTIGAR;
        case "bloquear": return TutorialType.BLOQUEAR;
        case "contestar": return TutorialType.CONTESTAR;
        case "continuar": return TutorialType.CONTINUAR;
        case "religiao": return TutorialType.RELIGIAO;
        case "trocar_religiao": return TutorialType.TROCAR_RELIGIAO;
        case "corrupcao": return TutorialType.CORRUPCAO;
        case "deveres": return TutorialType.DEVERES;
        default: return defaultTutorial;
    }
}