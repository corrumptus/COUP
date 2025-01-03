"use client";

import { useState } from "react";
import Header from "@components/tutorial/Header";
import SideBar from "@components/tutorial/SideBar";
import SelectedTutorial from "@components/tutorial/SelectedTutorial";
import { TutorialType } from "@type/tutorial";

export default function Tutorial() {
    const [ selectedTutorial, setTutorial ] = useState<TutorialType>(TutorialType.INTRODUCAO);

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="h-full flex overflow-hidden">
                <SideBar selectedTutorial={selectedTutorial} setTutorial={setTutorial} />
                <SelectedTutorial tutorial={selectedTutorial} />
            </div>
        </div>
    )
}