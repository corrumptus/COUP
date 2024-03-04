"use client"

import { useRouter } from "next/navigation";
import Header from "./components/Header";

export default function Home() {
  const router = useRouter();

  function openServers() {
    
  }

  function openRules() {

  }

  return (
    <div
      className="h-full bg-[url(../public/home-coup-image.jpg)] bg-center bg-no-repeat bg-cover flex flex-col"
    >
      <Header />
      <main className="grid content-center h-full justify-items-start gap-1 pl-2">
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
