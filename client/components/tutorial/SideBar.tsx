"use client"

import { TutorialType } from "@type/tutorial"

export default function SideBar({
    selectedTutorial,
    setTutorial
}: {
    selectedTutorial: TutorialType,
    setTutorial: (tutorial: TutorialType) => void
}) {
    function handleSelection(tutorial: string) {
        setTutorial(tutorial as TutorialType);
    }

    return (
        <nav className="h-full bg-[#c1c1c1] p-3 flex flex-col gap-6 overflow-auto">
            <p
                id={TutorialType.INTRODUCAO}
                className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.INTRODUCAO ? " tutorial_sidebar_item_selected" : ""}`}
                onClick={e => handleSelection((e.target as HTMLParagraphElement).id)}
            >introdução</p>
            <div>
                <p className="font-bold">Cartas</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.ASSASSINO}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.ASSASSINO ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Assassino</li>
                    <li
                        id={TutorialType.CAPITAO}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.CAPITAO ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Capitão</li>
                    <li
                        id={TutorialType.CONDESSA}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.CONDESSA ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Condessa</li>
                    <li
                        id={TutorialType.DUQUE}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.DUQUE ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Duque</li>
                    <li
                        id={TutorialType.EMBAIXADOR}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.EMBAIXADOR ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Embaixador</li>
                    <li
                        id={TutorialType.INQUISIDOR}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.INQUISIDOR ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Inquisidor</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Ações Gerais</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.RENDA}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.RENDA ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Renda</li>
                    <li
                        id={TutorialType.AJUDA_EXTERNA}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.AJUDA_EXTERNA ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Ajuda externa</li>
                    <li
                        id={TutorialType.GOLPE_ESTADO}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.GOLPE_ESTADO ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Golpe de estado</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Ações de Carta</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.ASSASSINAR}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.ASSASSINAR ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Assassinar</li>
                    <li
                        id={TutorialType.EXTORQUIR}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.EXTORQUIR ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Extorquir</li>
                    <li
                        id={TutorialType.TAXAR}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.TAXAR ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Taxar</li>
                    <li
                        id={TutorialType.TROCAR}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.TROCAR ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Trocar</li>
                    <li
                        id={TutorialType.INVESTIGAR}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.INVESTIGAR ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Investigar</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Contra-Ações</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.BLOQUEAR}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.BLOQUEAR ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Bloquear</li>
                    <li
                        id={TutorialType.CONTESTAR}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.CONTESTAR ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Contestar</li>
                    <li
                        id={TutorialType.CONTINUAR}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.CONTINUAR ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Continuar</li>
                </ul>
            </div>
            <div>
                <p className="font-bold">Religião</p>
                <ul className="pl-4">
                    <li
                        id={TutorialType.RELIGIAO}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.RELIGIAO ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Religião</li>
                    <li
                        id={TutorialType.CORRUPCAO}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.CORRUPCAO ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Corrupção</li>
                    <li
                        id={TutorialType.DEVERES}
                        className={`tutorial_sidebar_item_text_shadow${selectedTutorial === TutorialType.DEVERES ? " tutorial_sidebar_item_selected" : ""}`}
                        onClick={e => handleSelection((e.target as HTMLLIElement).id)}
                    >Deveres</li>
                </ul>
            </div>
        </nav>
    )
}