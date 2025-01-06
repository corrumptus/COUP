"use client";

import { useEffect, useState } from "react";
import Header from "@components/tutorial/Header";
import SideBar from "@components/tutorial/SideBar";
import SelectedTutorial from "@components/tutorial/SelectedTutorial";
import { TutorialType } from "@type/tutorial";
import useDeviceWidth from "@hooks/useDeviceWidth";

export default function Tutorial() {
    const [ selectedTutorial, setTutorial ] = useState<TutorialType>(TutorialType.INTRODUCAO);
    const [ isOpen, setIsOpen ] = useState<boolean | undefined>(undefined);
    const isMobileDevice = useDeviceWidth() <= 700;

    useEffect(() => {
        if (isMobileDevice)
            setIsOpen(false);
        else
            setIsOpen(undefined);
    }, [isMobileDevice]);

    function goToTutorial(tutorial: TutorialType) {
        setTutorial(tutorial);

        if (isMobileDevice)
            setIsOpen(false);
    }

    return (
        <div className="h-screen flex flex-col">
            <Header isOpened={isOpen} change={() => setIsOpen(prev => !prev)} />
            <div className="h-full grid grid-cols-[max-content_auto] overflow-hidden relative">
                <SideBar
                    isMobile={isMobileDevice}
                    isOpen={isOpen !== undefined ? isOpen : true}
                    selectedTutorial={selectedTutorial}
                    goTo={goToTutorial}
                />
                <div className="w-full bg-[#634c2b] p-4 overflow-auto">
                    <SelectedTutorial
                        tutorial={selectedTutorial}
                        goTo={goToTutorial}
                    />
                </div>
            </div>
        </div>
    )
}