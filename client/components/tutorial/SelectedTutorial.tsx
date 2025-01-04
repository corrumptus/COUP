import { TutorialType } from "@type/tutorial"
import Image from "next/image"

export default function SelectedTutorial({
    tutorial,
    goTo
}: {
    tutorial: TutorialType,
    goTo: (tutorialType: TutorialType) => void
}) {
    if (tutorial === TutorialType.ASSASSINO) return (
        <SelectedTutorialLayout title="Assassino">
            <p>A carta Assassino é uma influência que irá eleminar a carta
            escolhida pelo jogador pelo preço de 3 moedas.</p>

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
                    <li onClick={() => goTo(TutorialType.ASSASSINAR)}>Assassinar</li>
                </ul>
            </div>
        </SelectedTutorialLayout> 
    )

    return (
        <SelectedTutorialLayout title="Introdução">
            <p>O COUP é um jogo de cartas onde cada jogador recebe 2 cartas e
            2 moedas e seu objetivo é eliminar as cartas de outros jogadores
            até ser o último no jogador com cartas vivas.</p>

            <p>Cada jogador possui 2 cartas(influências) que fazem ações únicas,
            mas se ninguém sabe as suas cartas, elas são de qualquer tipo.</p>

            <p>As cartas são: assassino, capitão, condessa, duque, embaixador e
            inquisidor.</p>

            <p>Todo jogador começa com 2 moedas, que podem ser usadas para dar um
            golpe de estado por 7 moedas.</p>
        </SelectedTutorialLayout>
    )
}

function SelectedTutorialLayout({
    title,
    children
}: {
    title: string,
    children: React.ReactNode
}) {
    return (
        <main className="h-full bg-[url(../public/papiro.png)] bg-[length:100%_100%] bg-no-repeat px-[5%] pc:px-[4%] pt-[55px] pb-[65px] pc:pt-[calc(((100vh-52px-5rem)/2)*0.2)] pc:pb-[calc(((100vh-52px-5rem)/2)*0.24)] overflow-hidden">
            <div className="h-full flex flex-col gap-1 overflow-auto">
                <header className="text-3xl font-extrabold">{title}</header>
                <div className="flex flex-col gap-4">
                    {children}
                </div>
            </div>
        </main>
    )
}