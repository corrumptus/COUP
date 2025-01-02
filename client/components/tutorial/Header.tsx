import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    return (
        <header className="w-full p-3">
            <div className="flex gap-3 justify-center" onClick={() => router.push("/")}>
                <Image
                    src="coup-logo.png"
                    alt="carta com um C e uma faixa verde com coup escrito"
                />
                Página inicial
            </div>
        </header>
    )
}