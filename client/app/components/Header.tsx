import Image from "next/image"
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const coupLogoLength = 50;

  return (
    <header className="bg-sky-400 flex justify-between items-center p-2.5">
      <div>
        <Image
          src="/coup-logo.png"
          alt="a"
          width={coupLogoLength}
          height={coupLogoLength}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>
      <div className="flex gap-x-3">
        <button onClick={() => router.push("/login")}>Entrar</button>
        <button 
          className="bg-sky-50 border-black border-2 rounded-3xl p-1.5 text-base font-bold"
          onClick={() => router.push("/sign-up")}
        >Inscrever-se</button>
      </div>
    </header>
  )
}