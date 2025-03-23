import Image from "next/image";
import TutorialLayout from "@components/tutorial/TutorialLayout";
import TutorialType from "@type/tutorial";
import GameViewTutorial from "./gameView/GameViewTutorial";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";
import { Action, Card, Religion } from "@type/game";
import { PlayerCardColor } from "@utils/utils";
import { CardVersion } from "@type/gameUI";

export default function SelectedTutorial({
    tutorial,
    goTo,
    colors,
    cardVersions
}: {
    tutorial: TutorialType,
    goTo: (tutorialType: TutorialType) => void,
    colors: PlayerCardColor,
    cardVersions: {
        player: { first: CardVersion, second: CardVersion },
        players: { first: CardVersion, second: CardVersion }[]
    }
}) {
    if (tutorial === TutorialType.ASSASSINO) return (
        <TutorialLayout title="Assassino">
            <p>
                A carta Assassino é uma influência que irá
                {" "}
                <span className="border-b border-black border-dotted cursor-help" title="ação Assassinar">
                    eleminar a carta escolhida pelo jogador pelo preço de 3 moedas
                </span>
                .
            </p>

            <div className="flex flex-wrap gap-3">
                <Image
                    src="/assassino1.png"
                    alt="carta do assassino versão 1"
                    width={100}
                    height={130}
                />
                <Image
                    src="/assassino2.png"
                    alt="carta do assassino versão 2"
                    width={100}
                    height={130}
                />
                <Image
                    src="/assassino3.png"
                    alt="carta do assassino versão 3"
                    width={100}
                    height={130}
                />
            </div>

            <div>
                <p>Ações usadas</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.ASSASSINAR)}
                    >
                        Assassinar
                    </li>
                </ul>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.INTRODUCAO)}
                >
                    Anterior(Introdução)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.CAPITAO)}
                >
                    Próximo(Capitão)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout> 
    )

    if (tutorial === TutorialType.CAPITAO) return (
        <TutorialLayout title="Capitão">
            <p>
                A carta Capitão é uma influência que irá
                {" "}
                <span className="border-b border-black border-dotted cursor-help" title="ação Extorquir">
                    roubar até 2 moedas de outro jogador
                </span>
                {" "}
                e também pode bloquear uma extorção.
            </p>

            <div className="flex flex-wrap gap-3">
                <Image
                    src="/capitao1.png"
                    alt="carta do capitão versão 1"
                    width={100}
                    height={130}
                />
                <Image
                    src="/capitao2.png"
                    alt="carta do capitão versão 2"
                    width={100}
                    height={130}
                />
                <Image
                    src="/capitao3.png"
                    alt="carta do capitão versão 3"
                    width={100}
                    height={130}
                />
            </div>

            <div>
                <p>Ações usadas</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.EXTORQUIR)}
                    >
                        Extorquir
                    </li>
                </ul>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.ASSASSINO)}
                >
                    Anterior(Assassino)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.CONDESSA)}
                >
                    Próximo(Condessa)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout> 
    )

    if (tutorial === TutorialType.CONDESSA) return (
        <TutorialLayout title="Condessa">
            <p>A carta Condessa é uma influência que irá bloquear a ação assassinar.</p>

            <div className="flex flex-wrap gap-3">
                <Image
                    src="/condessa1.png"
                    alt="carta do condessa versão 1"
                    width={100}
                    height={130}
                />
                <Image
                    src="/condessa2.png"
                    alt="carta do condessa versão 2"
                    width={100}
                    height={130}
                />
                <Image
                    src="/condessa3.png"
                    alt="carta do condessa versão 3"
                    width={100}
                    height={130}
                />
            </div>

            <div>
                <p>Ações usadas</p>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.CAPITAO)}
                >
                    Anterior(Capitão)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.DUQUE)}
                >
                    Próximo(Duque)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout> 
    )

    if (tutorial === TutorialType.DUQUE) return (
        <TutorialLayout title="Duque">
            <p>
                A carta Duque é uma influência que irá
                {" "}
                <span className="border-b border-black border-dotted cursor-help" title="ação Taxar">
                    pegar 3 moedas do banco
                </span>
                {" "}
                e pode bloquear o uso de ajuda externa.
            </p>

            <div className="flex flex-wrap gap-3">
                <Image
                    src="/duque1.png"
                    alt="carta do duque versão 1"
                    width={100}
                    height={130}
                />
                <Image
                    src="/duque2.png"
                    alt="carta do duque versão 2"
                    width={100}
                    height={130}
                />
                <Image
                    src="/duque3.png"
                    alt="carta do duque versão 3"
                    width={100}
                    height={130}
                />
            </div>

            <div>
                <p>Ações usadas</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.TAXAR)}
                    >
                        Taxar
                    </li>
                </ul>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.CONDESSA)}
                >
                    Anterior(Condessa)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.EMBAIXADOR)}
                >
                    Próximo(Embaixador)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout> 
    )

    if (tutorial === TutorialType.EMBAIXADOR) return (
        <TutorialLayout title="Embaixador">
            <p>
                A carta Embaixador é uma influência que irá
                {" "}
                <span className="border-b border-black border-dotted cursor-help" title="ação Trocar">
                    trocar as 2 influências do jogador
                </span>
                {" "}
                e pode bloquear uma extorção.
            </p>

            <div className="flex flex-wrap gap-3">
                <Image
                    src="/embaixador1.png"
                    alt="carta do embaixador versão 1"
                    width={100}
                    height={130}
                />
                <Image
                    src="/embaixador2.png"
                    alt="carta do embaixador versão 2"
                    width={100}
                    height={130}
                />
                <Image
                    src="/embaixador3.png"
                    alt="carta do embaixador versão 3"
                    width={100}
                    height={130}
                />
            </div>

            <div>
                <p>Ações usadas</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.TROCAR)}
                    >
                            Trocar(2 cartas)
                    </li>
                </ul>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.DUQUE)}
                >
                    Anterior(Duque)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.INQUISIDOR)}
                >
                    Próximo(Inquisidor)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout> 
    )

    if (tutorial === TutorialType.INQUISIDOR) return (
        <TutorialLayout title="Inquisidor">
            <p>
                A carta Inquisidor é uma influência que irá
                {" "}
                <span className="border-b border-black border-dotted cursor-help" title="ação Trocar">
                    trocar uma influência do jogador
                </span>
                ,
                {" "}
                <span className="border-b border-black border-dotted cursor-help" title="ação Investigar">
                    pode ver uma influência de outro jogador e descidir se irá trocar ou mante-la
                </span>
                {" "}
                ou bloquear uma extorção.
            </p>

            <div className="flex flex-wrap gap-3">
                <Image
                    src="/inquisidor1.png"
                    alt="carta do inquisidor versão 1"
                    width={100}
                    height={130}
                />
                <Image
                    src="/inquisidor2.png"
                    alt="carta do inquisidor versão 2"
                    width={100}
                    height={130}
                />
                <Image
                    src="/inquisidor3.png"
                    alt="carta do inquisidor versão 3"
                    width={100}
                    height={130}
                />
            </div>

            <div>
                <p>Ações usadas</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.TROCAR)}
                    >
                        Trocar(1 carta)
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.INVESTIGAR)}
                    >
                        Investigar
                    </li>
                </ul>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.EMBAIXADOR)}
                >
                    Anterior(Embaixador)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.RENDA)}
                >
                    Próximo(Renda)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout> 
    )

    if (tutorial === TutorialType.RENDA) return (
        <TutorialLayout title="Renda">
            <p>A ação Renda é uma ação em que o jogador pega 1 moeda do banco.</p>

            <p>Não pode ser bloqueada ou contestada.</p>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.INQUISIDOR)}
                >
                    Anterior(Inquisidor)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.AJUDA_EXTERNA)}
                >
                    Próximo(Ajuda externa)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    

    if (tutorial === TutorialType.AJUDA_EXTERNA) return (
        <TutorialLayout title="Ajuda externa">
            <p>A ação Ajuda externa é uma ação que o jogador pega 2 moedas do banco.</p>

            <p>Pode ser bloqueada pelo Duque.</p>

            <p>Não pode ser contestada.</p>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.RENDA)}
                >
                    Anterior(Renda)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.GOLPE_ESTADO)}
                >
                    Próximo(Golpe de Estado)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    

    if (tutorial === TutorialType.GOLPE_ESTADO) return (
        <TutorialLayout title="Golpe de estado">
            <p>
                A ação Golpe de estado é uma ação que o jogador elimina 1 influência
                {" "}
                escolhida de outro jogador pelo preço de 7 moedas.
            </p>

            <p>
                Se um jogador iniciar um turno com 10 ou mais moedas ele é obrigado
                {" "}
                a dar um golpe de estado.
            </p>

            <p>Não pode ser bloqueado ou contestado.</p>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.AJUDA_EXTERNA)}
                >
                    Anterior(Ajuda externa)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.ASSASSINAR)}
                >
                    Próximo(Assassinar)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.ASSASSINAR) return (
        <TutorialLayout title="Assassinar">
            <p>
                A ação Assassinar é uma ação que elimina uma influência escolhida
                {" "}
                pelo jogador pelo preço de 3 moedas.
            </p>

            <div>
                <p>Cartas que usam</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.ASSASSINO)}
                    >
                        Assassino
                    </li>
                </ul>
            </div>

            <div>
                <p>Cartas que bloqueiam</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.CONDESSA)}
                    >
                        Condessa
                    </li>
                </ul>
            </div>

            <div className="grid place-items-center">
                <div className="w-[80%]">
                    <GameViewTutorial
                        isDiffsVisible={false}
                        isNextPersonVisible={false}
                        gameState={{
                            player: {
                                name: "playerName",
                                money: 2,
                                cards: [
                                    {
                                        card: Card.ASSASSINO,
                                        isDead: false,
                                    },
                                    {
                                        card: Card.DUQUE,
                                        isDead: false,
                                    }
                                ],
                                religion: Religion.PROTESTANTE
                            },
                            game: {
                                asylum: 0,
                                playerOfTurn: "playerName",
                                currentPlayer: "playerName",
                                players: [
                                    {
                                        name: "firstEnemy",
                                        money: 2,
                                        cards: [
                                            {
                                                card: undefined,
                                                isDead: false,
                                            },
                                            {
                                                card: undefined,
                                                isDead: false,
                                            }
                                        ],
                                        religion: Religion.CATOLICA
                                    },
                                    {
                                        name: "secondEnemy",
                                        money: 2,
                                        cards: [
                                            {
                                                card: undefined,
                                                isDead: false,
                                            },
                                            {
                                                card: undefined,
                                                isDead: false,
                                            }
                                        ],
                                        religion: Religion.CATOLICA
                                    }
                                ],
                                configs: COUPDefaultConfigs
                            },
                            context: {
                                lastAction: {
                                    player: "playerName",
                                    action: Action.CONTINUAR,
                                    isInvestigating: false,
                                    winContesting: false
                                },
                                allowedActions: {
                                    player: [],
                                    enemys: [
                                        {
                                            name: "firstenemy",
                                            actions: [Action.ASSASSINAR]
                                        }
                                    ],
                                    defense: []
                                },
                                previousAction: Action.CONTINUAR
                            }
                        }}
                        requeriments={{}}
                        colors={colors}
                        cardVersions={cardVersions}
                    />
                </div>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.GOLPE_ESTADO)}
                >
                    Anterior(Golpe de estado)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.EXTORQUIR)}
                >
                    Próximo(Extorquir)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.EXTORQUIR) return (
        <TutorialLayout title="Extorquir">
            <p>A ação Extorquir é uma ação que rouba até 2 moedas de outro jogador.</p>

            <div>
                <p>Cartas que usam</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.CAPITAO)}
                    >
                        Capitão
                    </li>
                </ul>
            </div>

            <div>
                <p>Cartas que bloqueiam</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.CAPITAO)}
                    >
                        Capitão
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.EMBAIXADOR)}
                    >
                        Embaixador
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.INQUISIDOR)}
                    >
                        Inquisidor
                    </li>
                </ul>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.ASSASSINAR)}
                >
                    Anterior(Assassinar)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.TAXAR)}
                >
                    Próximo(Taxar)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.TAXAR) return (
        <TutorialLayout title="Taxar">
            <p>
                A ação Taxar é uma ação que pega 3 moedas do banco e pode bloquear a
                {" "}
                ação Ajuda externa.
            </p>

            <div>
                <p>Cartas que usam</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.DUQUE)}
                    >
                        Duque
                    </li>
                </ul>
            </div>

            <div>
                <p>Cartas que bloqueiam</p>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.EXTORQUIR)}
                >
                    Anterior(Extorquir)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.TROCAR)}
                >
                    Próximo(Trocar)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.TROCAR) return (
        <TutorialLayout title="Trocar">
            <p>A ação Trocar é uma ação que pode trocar as influências do jogador.</p>

            <div>
                <p>Cartas que usam</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.EMBAIXADOR)}
                    >
                        Embaixador(2 cartas)
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.INQUISIDOR)}
                    >
                        Inquisidor(1 carta)
                    </li>
                </ul>
            </div>

            <div>
                <p>Cartas que bloqueiam</p>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.TAXAR)}
                >
                    Anterior(Taxar)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.INVESTIGAR)}
                >
                    Próximo(Investigar)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.INVESTIGAR) return (
        <TutorialLayout title="Investigar">
            <p>
                A ação Investigar é uma ação que permite ao jogador ver que influência
                {" "}
                outro jogador possui e ainda se ele gostaria de manter ou de trocar a
                {" "}
                a influência do outro jogador.
            </p>

            <div>
                <p>Cartas que usam</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.INQUISIDOR)}
                    >
                        Inquisidor
                    </li>
                </ul>
            </div>

            <div>
                <p>Cartas que bloqueiam</p>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.TROCAR)}
                >
                    Anterior(Trocar)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.BLOQUEAR)}
                >
                    Próximo(Bloquear)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.BLOQUEAR) return (
        <TutorialLayout title="Bloquear">
            <p>
                A ação Bloquear é uma contra-ação que cancela a ação bloqueada e, se aceita,
                {" "}
                faz o turno acabar.
            </p>

            <div>
                <p>Ações bloqueáveis</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.AJUDA_EXTERNA)}
                    >Ajuda 
                    externa
                </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.EXTORQUIR)}
                    >
                        Extorquir
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.ASSASSINAR)}
                    >
                        Assassinar
                    </li>
                </ul>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.INVESTIGAR)}
                >
                    Anterior(Investigar)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.CONTESTAR)}
                >
                    Próximo(Contestar)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.CONTESTAR) return (
        <TutorialLayout title="Contestar">
            <p>
                A ação Contestar é uma contra-ação que verifica se a ação anterior
                {" "}
                realmente pode ser feita pela influência indicada pelo jogador que
                {" "}
                realizou a ação.
            </p>

            <p>
                Se o jogador que realizou a ação não estava mentindo, o jogador que
                {" "}
                contestou perderá a influência indicada para a contestação. Caso contrário
                {" "}
                o jogador que realizou a ação perderá a ação e a influência indicada.
            </p>

            <p>
                Quando um jogador contesta uma ação que envolve uma de suas influências,
                {" "}
                está será a influência que será perdida caso o jogador que foi contestado
                {" "}
                esteja falando a verdade.
            </p>

            <p>
                Embora A escolha de trocar quando se usa a ação investigar seja retratada
                {" "}
                como a ação trocar, ela não é contestável.
            </p>

            <div>
                <p>Ações contestáveis</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.TAXAR)}
                    >
                        Taxar
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.CORRUPCAO)}
                    >
                        Corrupção
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.EXTORQUIR)}
                    >
                        Extorquir
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.ASSASSINAR)}
                    >
                        Assassinar
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.INVESTIGAR)}
                    >
                        Investigar
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.TROCAR)}
                    >
                        Trocar
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.BLOQUEAR)}
                    >
                        Bloquear
                    </li>
                </ul>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.BLOQUEAR)}
                >
                    Anterior(Bloquear)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.CONTINUAR)}
                >
                    Próximo(Continuar)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.CONTINUAR) return (
        <TutorialLayout title="Continuar">
            <p>
                A ação Continuar é a contra-ação que indica que o jogador não bloqueou ou
                contestou uma ação.
            </p>

            <div>
                <p>Ações aceitáveis</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.EXTORQUIR)}
                    >
                        Extorquir
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.ASSASSINAR)}
                    >
                        Assassinar
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.INVESTIGAR)}
                    >
                        Investigar
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.BLOQUEAR)}
                    >
                        Bloquear
                    </li>
                </ul>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.CONTESTAR)}
                >
                    Anterior(Contestar)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.RELIGIAO)}
                >
                    Próximo(Religiao)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.RELIGIAO) return (
        <TutorialLayout title="Religião">
            <p>
                Quando o dono do servidor decide instaurar A Reforma, os jogadores
                {" "}
                recebem uma denominação religiosa aleatória sendo elas Católica ou Protestante.
                {" "}
                Os jogadores agora podem usar 2 novas ações: Trocar Religião e Corrupção.
            </p>

            <p>Jogadores que tem a mesma religião tem o dever de não se atacarem.</p>

            <p>
                A Reforma cria uma entedidade fictícia que guarda moedas de ações de troca
                {" "}
                de religião. No jogo físico o banco também é o asilo, porém nessa edição virtual
                {" "}
                ele também não possui nenhuma representação.
            </p>

            <p>
                Para resgatar as moedas guardadas dentro do asilo é preciso que o jogador
                {" "}
                use corrupção.
            </p>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.CONTINUAR)}
                >
                    Anterior(Continuar)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.TROCAR_RELIGIAO)}
                >
                    Próximo(Trocar Religião)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.TROCAR_RELIGIAO) return (
        <TutorialLayout title="Trocar religião">
            <p>
                A ação Trocar Religião é uma ação que troca a religião do próprio jogador
                {" "}
                pelo preço de 1 moeda ou troca a religião de outro jogador pelo preço de 2 moedas.
            </p>

            <p>Não pode ser bloqueada ou contestada.</p>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.RELIGIAO)}
                >
                    Anterior(Religião)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.CORRUPCAO)}
                >
                    Próximo(Corrupção)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.CORRUPCAO) return (
        <TutorialLayout title="Corrupção">
            <p>
                A ação Corrupção é uma ação que pega todas as moedas do asilo
                {" "}
                sob o pretexto de que o jogador não possui a influência Duque
                {" "}
                na carta indicada.
            </p>

            <p>Não pode ser bloqueado.</p>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.TROCAR_RELIGIAO)}
                >
                    Anterior(Trocar Religião)
                </button>
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.DEVERES)}
                >
                    Próximo(Deveres)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    if (tutorial === TutorialType.DEVERES) return (
        <TutorialLayout title="Deveres">
            <p>
                Os Deveres são as ações que não podem ser feitas a outros jogadores que
                que tem a mesma religião que o jogador.
            </p>

            <p>
                Caso todos os jogadores possuam a mesma religião, ela pode ou não
                ser ignorada.
            </p>

            <div>
                <p>Deveres</p>
                <ul className="pl-4">
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.TAXAR)}
                    >
                        Bloquear Ajuda externa(Taxar)
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.EXTORQUIR)}
                    >
                        Extorquir
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.ASSASSINAR)}
                    >
                        Assassinar
                    </li>
                    <li
                        className="italic cursor-pointer text-blue-800 hover:text-blue-600"
                        onClick={() => goTo(TutorialType.GOLPE_ESTADO)}
                    >
                        Golpe de Estado
                    </li>
                </ul>
            </div>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-1 hover:scale-110"
                    onClick={() => goTo(TutorialType.CORRUPCAO)}
                >
                    Anterior(Corrupção)
                </button>
                <div className="absolute left-1/2 w-px h-full bg-slate-950"></div>
            </div>
        </TutorialLayout>
    )

    return (
        <TutorialLayout title="Introdução">
            <p>
                O COUP é um jogo de cartas onde cada jogador recebe 2 cartas e
                {" "}
                2 moedas e seu objetivo é eliminar as cartas de outros jogadores
                {" "}
                até ser o último jogador com cartas vivas.
            </p>

            <p>
                Cada jogador possui 2 cartas(influências) que fazem ações únicas,
                {" "}
                mas se ninguém sabe quais são as suas cartas, elas são de qualquer tipo.
                {" "}
            </p>

            <p>
                As cartas são: assassino, capitão, condessa, duque, embaixador e
                {" "}
                inquisidor.
            </p>

            <p>
                Todo jogador começa com 2 moedas e pode obter mais pegando do banco ou roubando.
                {" "}
                O banco é uma entidade fictícia que guarda as moedas no jogo físico, porém não possui
                {" "}
                uma representação nessa edição virtual.
            </p>

            <p>Cada turno começa com um jogador e ele é obrigado a fazer uma ação (se puder pagar).</p>

            <div className="w-full grid grid-cols-2 h-12 relative overflow-hidden">
                <button
                    className="h-10 col-start-2 hover:scale-110"
                    onClick={() => goTo(TutorialType.ASSASSINO)}
                >
                    Próximo(Assassino)
                </button>
                <div
                    className="absolute left-1/2 w-px h-full bg-slate-950"
                ></div>
            </div>
        </TutorialLayout>
    )
}