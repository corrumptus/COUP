"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    return (
        <header className="w-full p-3 bg-[#eaaf73]">
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
        </header>
    )
}