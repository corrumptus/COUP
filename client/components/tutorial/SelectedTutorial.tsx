import { TutorialType } from "@type/tutorial"

export default function SelectedTutorial({
    tutorial
}: {
    tutorial: TutorialType
}) {
    return (
        <SelectedTutorialLayout title="Introdução">
            Introdução
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
        <main className="h-full bg-[url(../public/papiro.png)] bg-[length:100%_100%] bg-no-repeat px-[5%] pc:px-[2%] pt-[55px] pb-[65px] pc:pt-[calc(((100vh-52px-5rem)/2)*0.2)] pc:pb-[calc(((100vh-52px-5rem)/2)*0.24)]">
            <header>{title}</header>
            {children}
        </main>
    )
}