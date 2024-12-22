import type { COUPSocket } from "@type/socket";
import { useState } from "react";

export default function WinnerView({
    name,
    isOwner,
    socket,
    goToLobbyView,
    leave
}: {
    name: string,
    isOwner: boolean,
    socket: COUPSocket,
    goToLobbyView: () => void,
    leave: () => void
}) {
    const [ trasition, setTransition ] = useState(false);

    setTimeout(() => {
        setTransition(true);
    }, 2000);

    return (
        <div>
            <p>{name}</p>
            {trasition &&
                <>
                    {isOwner &&
                        <>
                            <button onClick={() => {
                                goToLobbyView();
                                socket.emit("finishMatch");
                            }}>Voltar para o lobby</button>
                            <button onClick={() => socket.emit("restartMatch")}>Reiniciar o jogo</button>
                        </>
                    }
                    <button onClick={leave}>Sair do jogo</button>
                </>
            }
        </div>
    )
}