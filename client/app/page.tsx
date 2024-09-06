"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@pages/Header";
import LobbysView from "@pages/LobbysView";
import Toasters from "@/utils/Toasters";

export default function Home() {
  const router = useRouter();
  const [ isServersVisible, setServersVisibility ] = useState(false);

  return (
    <div
      className="h-full bg-[url(../public/home-page.png)] bg-center bg-no-repeat bg-cover flex flex-col"
    >
      <Header />
      <main className="grid content-center h-full justify-items-start gap-2.5 pl-2.5 relative">
        <Toasters />
        {isServersVisible &&
          <LobbysView closeView={() => setServersVisibility(false)}/>
        }
        <button className="home_button" onClick={() => setServersVisibility(true)}>Jogar</button>
        <button className="home_button" onClick={() => router.push("/regras")}>Regras</button>
        <button className="home_button" onClick={() => router.push("/tutorial")}>Tutorial</button>
        <button className="home_button" onClick={() => router.push("/stats")}>Estatísticas</button>
        <button className="home_button" onClick={() => router.push("/creditos")}>Créditos</button>
      </main>
    </div>
  );
}
