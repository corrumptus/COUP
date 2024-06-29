"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@pages/Header";
import LobbysView from "@pages/LobbysView";
import Toasters, { newToaster } from "@/utils/Toasters";

export default function Home() {
  const router = useRouter();
  const [ isServersVisible, setServersVisibility ] = useState(false);

  async function createServer() {
    if (localStorage.getItem("coup-token") === null) {
      router.push("/sign-up");
      return;
    }

    const response = await fetch("http://localhost:5000/lobby", {
      headers: {
        Authorization: localStorage.getItem("coup-token") as string
      },
      method: "POST"
    });

    const result: { error: string } | number = await response.json();

    if (!response.ok) {
      newToaster((result as { error: string }).error);
      return;
    }

    router.push("/jogar/" + (result as number).toString());
  }

  return (
    <div
      className="h-full bg-[url(../public/home-page.png)] bg-center bg-no-repeat bg-cover flex flex-col"
    >
      <Header />
      <main className="grid content-center h-full justify-items-start gap-1 pl-2.5 relative">
        <Toasters />
        {isServersVisible &&
          <LobbysView closeView={() => setServersVisibility(false)}/>
        }
        <button className="home_button" onClick={createServer}>Jogar</button>
        <button className="home_button" onClick={() => setServersVisibility(true)}>Servidores</button>
        <button className="home_button" onClick={() => router.push("/regras")}>Regras</button>
        <button className="home_button" onClick={() => router.push("/tutorial")}>Tutorial</button>
        <button className="home_button" onClick={() => router.push("/stats")}>Estatísticas</button>
        <button className="home_button" onClick={() => router.push("/creditos")}>Créditos</button>
      </main>
    </div>
  );
}
