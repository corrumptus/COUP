"use client";

import { TutorialType } from "@type/tutorial";

export default function SideBar({
    isOpen,
    isMobile,
    selectedTutorial,
    goTo
}: {
    isOpen: boolean,
    isMobile: boolean,
    selectedTutorial: TutorialType,
    goTo: (tutorial: TutorialType) => void
}) {
    function itemStyle(tutorial: TutorialType) {
        if (selectedTutorial === tutorial)
            return "px-2 cursor-pointer text-sky-400 font-bold border-sky-400 border-l";

        return "text-[#2d2d2d] px-2 cursor-pointer hover:text-sky-400 hover:font-bold";
    }

    return (
        <nav className={`h-full bg-slate-100 p-3 flex flex-col gap-6 overflow-auto${
            isMobile ? ` transition-[left] absolute ${
                isOpen ? "left-0 duration-500" : "-left-full duration-[1.2s]"
            }` : ""
        }`}>
            <p
                id={TutorialType.INTRODUCAO}
                className={itemStyle(TutorialType.INTRODUCAO)}
                onClick={e => goTo((e.target as HTMLParagraphElement).id as TutorialType)}
            >introdução</p>
            <div>
                <p className="font-bold">Cartas</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.ASSASSINO}
                        className={itemStyle(TutorialType.ASSASSINO)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Assassino</li>
                    <li
                        id={TutorialType.CAPITAO}
                        className={itemStyle(TutorialType.CAPITAO)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Capitão</li>
                    <li
                        id={TutorialType.CONDESSA}
                        className={itemStyle(TutorialType.CONDESSA)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Condessa</li>
                    <li
                        id={TutorialType.DUQUE}
                        className={itemStyle(TutorialType.DUQUE)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Duque</li>
                    <li
                        id={TutorialType.EMBAIXADOR}
                        className={itemStyle(TutorialType.EMBAIXADOR)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Embaixador</li>
                    <li
                        id={TutorialType.INQUISIDOR}
                        className={itemStyle(TutorialType.INQUISIDOR)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Inquisidor</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Ações Gerais</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.RENDA}
                        className={itemStyle(TutorialType.RENDA)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Renda</li>
                    <li
                        id={TutorialType.AJUDA_EXTERNA}
                        className={itemStyle(TutorialType.AJUDA_EXTERNA)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Ajuda externa</li>
                    <li
                        id={TutorialType.GOLPE_ESTADO}
                        className={itemStyle(TutorialType.GOLPE_ESTADO)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Golpe de estado</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Ações de Carta</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.ASSASSINAR}
                        className={itemStyle(TutorialType.ASSASSINAR)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Assassinar</li>
                    <li
                        id={TutorialType.EXTORQUIR}
                        className={itemStyle(TutorialType.EXTORQUIR)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Extorquir</li>
                    <li
                        id={TutorialType.TAXAR}
                        className={itemStyle(TutorialType.TAXAR)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Taxar</li>
                    <li
                        id={TutorialType.TROCAR}
                        className={itemStyle(TutorialType.TROCAR)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Trocar</li>
                    <li
                        id={TutorialType.INVESTIGAR}
                        className={itemStyle(TutorialType.INVESTIGAR)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Investigar</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Contra-Ações</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.BLOQUEAR}
                        className={itemStyle(TutorialType.BLOQUEAR)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Bloquear</li>
                    <li
                        id={TutorialType.CONTESTAR}
                        className={itemStyle(TutorialType.CONTESTAR)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Contestar</li>
                    <li
                        id={TutorialType.CONTINUAR}
                        className={itemStyle(TutorialType.CONTINUAR)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Continuar</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Religião</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.RELIGIAO}
                        className={itemStyle(TutorialType.RELIGIAO)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Religião</li>
                    <li
                        id={TutorialType.TROCAR_RELIGIAO}
                        className={itemStyle(TutorialType.TROCAR_RELIGIAO)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Trocar religião</li>
                    <li
                        id={TutorialType.CORRUPCAO}
                        className={itemStyle(TutorialType.CORRUPCAO)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Corrupção</li>
                    <li
                        id={TutorialType.DEVERES}
                        className={itemStyle(TutorialType.DEVERES)}
                        onClick={e => goTo((e.target as HTMLLIElement).id as TutorialType)}
                    >Deveres</li>
                </ul>
            </div>
        </nav>
    )
}