"use client";

import { useEffect, useState } from "react";
import Header from "@components/tutorial/Header";
import SideBar from "@components/tutorial/SideBar";
import SelectedTutorial from "@components/tutorial/SelectedTutorial";
import TutorialType, { getTutorialType } from "@type/tutorial";
import useDeviceWidth from "@hooks/useDeviceWidth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { generateColorCard } from "@utils/utils";
import { CardVersion } from "@type/gameUI";

export default function Tutorial() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedTutorial, setTutorial] = useState<TutorialType>(
    getTutorialType(searchParams.get("tutorial"))
  );
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);
  const isMobileDevice = useDeviceWidth() <= 700;

  const [colors, setColors] = useState(generateColorCard(true));
  const [cardVersions, setCardVersions] = useState({
    player: {
      first: 0 as CardVersion,
      second: 0 as CardVersion
    },
    players: [
      {
        first: 0 as CardVersion,
        second: 0 as CardVersion
      },
      {
        first: 0 as CardVersion,
        second: 0 as CardVersion
      }
    ]
  });

  useEffect(() => {
    setColors(generateColorCard());
    setCardVersions({
      player: {
        first: Math.floor(Math.random() * 3) as CardVersion,
        second: Math.floor(Math.random() * 3) as CardVersion
      },
      players: [
        {
          first: Math.floor(Math.random() * 3) as CardVersion,
          second: Math.floor(Math.random() * 3) as CardVersion
        },
        {
          first: Math.floor(Math.random() * 3) as CardVersion,
          second: Math.floor(Math.random() * 3) as CardVersion
        }
      ]
    });
  }, []);

  useEffect(() => {
    if (isMobileDevice)
      setIsOpen(false);
    else
      setIsOpen(undefined);
  }, [isMobileDevice]);

  function goToTutorial(tutorial: TutorialType) {
    setTutorial(tutorial);
    router.replace(`${pathName}?tutorial=${tutorial}`);

    if (isMobileDevice)
      setIsOpen(false);
  }

  return (
    <div className="h-screen flex flex-col">
      <Header isOpened={isOpen} change={() => setIsOpen(prev => !prev)} />
      <div className={`h-full grid${isMobileDevice ? "" : " grid-cols-[max-content_auto]"} overflow-hidden relative`}>
        <SideBar
          isMobile={isMobileDevice}
          isOpen={isOpen !== undefined ? isOpen : true}
          selectedTutorial={selectedTutorial}
          goTo={goToTutorial}
        />
        <div className="w-full bg-[#634c2b] p-4 overflow-auto font-['augusta'] text-2xl">
          <SelectedTutorial
            tutorial={selectedTutorial}
            goTo={goToTutorial}
            colors={colors}
            cardVersions={cardVersions}
          />
        </div>
      </div>
    </div>
  )
}