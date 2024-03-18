"use client"

import { useRouter } from "next/navigation";
import Header from "./components/home/Header";
import { useState } from "react";
import RulesView from "./components/home/RulesView";
import ServersView from "./components/home/LobbysView";

export default function Home() {
  const router = useRouter();
  const [ isServersVisible, setServersVisibility ] = useState(false);
  const [ isRulesVisible, setRulesVisibility ] = useState(false);

  function openServers() {
    setRulesVisibility(false);
    setServersVisibility(true);
  }

  function closeServers() {
    setServersVisibility(false);
  }

  function openRules() {
    setServersVisibility(false);
    setRulesVisibility(true);
  }

  function closeRules() {
    setRulesVisibility(false);
  }

  return (
    <div
      className="h-full bg-[url(../public/home-coup-image.webp)] bg-center bg-no-repeat bg-cover flex flex-col"
    >
      <Header />
      <main className="grid content-center h-full justify-items-start gap-1 pl-2.5 relative">
        {isServersVisible &&
          <ServersView closeView={closeServers}/>
        }
        {isRulesVisible &&
          <RulesView closeView={closeRules}/>
        }
        <button className="home_button" onClick={() => router.push("/jogar")}>Jogar</button>
        <button className="home_button" onClick={openServers}>Servidores</button>
        <button className="home_button" onClick={openRules}>Regras</button>
        <button className="home_button" onClick={() => router.push("/tutorial")}>Tutorial</button>
        <button className="home_button" onClick={() => router.push("/stats")}>Estatísticas</button>
        <button className="home_button" onClick={() => router.push("/creditos")}>Créditos</button>
      </main>
    </div>
  );
}
