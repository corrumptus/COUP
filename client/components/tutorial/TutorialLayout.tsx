export default function TutorialLayout({
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
    );
}
