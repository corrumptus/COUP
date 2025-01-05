"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HamburgerIcon from "@components/tutorial/HamburgerIcon";

export default function Header({
    isOpened,
    change
}: {
    isOpened: boolean | undefined,
    change: () => void
}) {
    const router = useRouter();

    return (
        <header className="w-full p-3 bg-[#eaaf73] flex items-center justify-between">
            <button
                className="w-fit flex gap-3 items-center"
                onClick={() => router.push("/")}
            >
                <Image
                    src="/coup-logo.png"
                    alt="carta com um C e uma faixa verde com coup escrito"
                    width={40}
                    height={34}
                />
                Início
            </button>
            {isOpened !== undefined && <HamburgerIcon isOpened={isOpened} change={change} />}
        </header>
    )
}