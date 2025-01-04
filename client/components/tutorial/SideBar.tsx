"use client";

import { TutorialType } from "@type/tutorial";

export default function SideBar({
    selectedTutorial,
    setTutorial
}: {
    selectedTutorial: TutorialType,
    setTutorial: (tutorial: TutorialType) => void
}) {
    function itemStyle(tutorial: TutorialType) {
        if (selectedTutorial === tutorial)
            return "px-2 cursor-pointer text-sky-400 font-bold border-sky-400 border-l";

        return "text-[#2d2d2d] px-2 cursor-pointer hover:text-sky-400 hover:font-bold";
    }

    function handleSelection(tutorial: string) {
        setTutorial(tutorial as TutorialType);
    }

    return (
        <nav className="h-full bg-slate-100 p-3 flex flex-col gap-6 overflow-auto">
            <p
                id={TutorialType.INTRODUCAO}
                className={itemStyle(TutorialType.INTRODUCAO)}
                onClick={e => handleSelection((e.target as HTMLParagraphElement).id)}
            >introdução</p>
            <div>
                <p className="font-bold">Cartas</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.ASSASSINO}
                        className={itemStyle(TutorialType.ASSASSINO)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Assassino</li>
                    <li
                        id={TutorialType.CAPITAO}
                        className={itemStyle(TutorialType.CAPITAO)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Capitão</li>
                    <li
                        id={TutorialType.CONDESSA}
                        className={itemStyle(TutorialType.CONDESSA)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Condessa</li>
                    <li
                        id={TutorialType.DUQUE}
                        className={itemStyle(TutorialType.DUQUE)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Duque</li>
                    <li
                        id={TutorialType.EMBAIXADOR}
                        className={itemStyle(TutorialType.EMBAIXADOR)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Embaixador</li>
                    <li
                        id={TutorialType.INQUISIDOR}
                        className={itemStyle(TutorialType.INQUISIDOR)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Inquisidor</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Ações Gerais</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.RENDA}
                        className={itemStyle(TutorialType.RENDA)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Renda</li>
                    <li
                        id={TutorialType.AJUDA_EXTERNA}
                        className={itemStyle(TutorialType.AJUDA_EXTERNA)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Ajuda externa</li>
                    <li
                        id={TutorialType.GOLPE_ESTADO}
                        className={itemStyle(TutorialType.GOLPE_ESTADO)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Golpe de estado</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Ações de Carta</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.ASSASSINAR}
                        className={itemStyle(TutorialType.ASSASSINAR)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Assassinar</li>
                    <li
                        id={TutorialType.EXTORQUIR}
                        className={itemStyle(TutorialType.EXTORQUIR)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Extorquir</li>
                    <li
                        id={TutorialType.TAXAR}
                        className={itemStyle(TutorialType.TAXAR)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Taxar</li>
                    <li
                        id={TutorialType.TROCAR}
                        className={itemStyle(TutorialType.TROCAR)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Trocar</li>
                    <li
                        id={TutorialType.INVESTIGAR}
                        className={itemStyle(TutorialType.INVESTIGAR)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Investigar</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Contra-Ações</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.BLOQUEAR}
                        className={itemStyle(TutorialType.BLOQUEAR)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Bloquear</li>
                    <li
                        id={TutorialType.CONTESTAR}
                        className={itemStyle(TutorialType.CONTESTAR)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Contestar</li>
                    <li
                        id={TutorialType.CONTINUAR}
                        className={itemStyle(TutorialType.CONTINUAR)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Continuar</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Religião</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.RELIGIAO}
                        className={itemStyle(TutorialType.RELIGIAO)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Religião</li>
                    <li
                        id={TutorialType.TROCAR_RELIGIAO}
                        className={itemStyle(TutorialType.TROCAR_RELIGIAO)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Trocar religião</li>
                    <li
                        id={TutorialType.CORRUPCAO}
                        className={itemStyle(TutorialType.CORRUPCAO)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Corrupção</li>
                    <li
                        id={TutorialType.DEVERES}
                        className={itemStyle(TutorialType.DEVERES)}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Deveres</li>
                </ul>
            </div>
        </nav>
    )
}