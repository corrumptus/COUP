import { useState } from "react";

export default function WinnerView({
    name,
    isOwner,
    goToLobbyView,
    restartMatch,
    leave
}: {
    name: string,
    isOwner: boolean,
    goToLobbyView: () => void,
    restartMatch: () => void,
    leave: () => void
}) {
    const [ transition, setTransition ] = useState(false);

    setTimeout(() => {
        setTransition(true);
    }, 2000);

    return (
        <div className="h-full w-full absolute bg-gray-500/70 z-[4] flex items-center justify-center">
            <div className="h-[60%] w-[75%] min-h-[200px] min-w-[250px] p-3 bg-red-500 bg-[url(../public/winner-background.png)] bg-contain bg-center bg-no-repeat flex flex-col items-center justify-around gap-4 rounded-3xl">
                <p className="text-4xl font-bold">{name}</p>
                <div className={`flex gap-4 transition-opacity ${transition ? "opacity-100" : "opacity-0"} duration-[2s]`}>
                    {isOwner &&
                        <>
                            <button className="bg-blue-300 rounded-xl p-1.5 hover:scale-110 hover:shadow-lg" onClick={goToLobbyView}>Voltar para o lobby</button>
                            <button className="bg-blue-300 rounded-xl p-1.5 hover:scale-110 hover:shadow-lg" onClick={restartMatch}>Reiniciar o jogo</button>
                        </>
                    }
                    <button className="bg-blue-300 rounded-xl p-1.5 hover:scale-110 hover:shadow-lg" onClick={leave}>Sair do jogo</button>
                </div>
            </div>
        </div>
    )
}