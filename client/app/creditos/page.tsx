"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Creditos() {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col">
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
      </header>
      <main className="h-full p-4 bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(../public/creditos-page.png)] bg-cover bg-center bg-no-repeat overflow-auto flex flex-col gap-4">
        <h1 className="text-center text-5xl text-white font-bold">Créditos</h1>
        <div className="w-full bg-white/85 rounded-xl p-2">
          <h2 className="text-3xl font-bold">COUP</h2>
          <p className="text-xl">Um jogo de cartas publicado pela editora: <a className="border-b border-blue-500" href="https://grokgames.com.br">Grok Games</a></p>
        </div>
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="w-full bg-white/85 rounded-xl p-2">
            <h2 className="text-3xl font-bold">Imagens de carta</h2>
            <p className="text-xl">Todas as imagens de cartas oficiais foram retiradas das <a className="border-b border-blue-500" href="https://onedrive.live.com/embed?resid=503C26352F3204B8!2051&authkey=!AF2N6PoGBAG3Ejg&em=2">regras</a></p>
            <ul className="flex flex-col flex-wrap gap-3">
              <Image
                src="/assassino1.png"
                alt="carta do assassino versão 1"
                width={100}
                height={130}
              />
              <Image
                src="/assassino2.png"
                alt="carta do assassino versão 2"
                width={100}
                height={130}
              />
              <Image
                src="/assassino3.png"
                alt="carta do assassino versão 3"
                width={100}
                height={130}
              />
              <Image
                src="/capitao1.png"
                alt="carta do capitao versão 1"
                width={100}
                height={130}
              />
              <Image
                src="/capitao2.png"
                alt="carta do capitao versão 2"
                width={100}
                height={130}
              />
              <Image
                src="/capitao3.png"
                alt="carta do capitao versão 3"
                width={100}
                height={130}
              />
              <Image
                src="/condessa1.png"
                alt="carta da condessa versão 1"
                width={100}
                height={130}
              />
              <Image
                src="/condessa2.png"
                alt="carta da condessa versão 2"
                width={100}
                height={130}
              />
              <Image
                src="/condessa3.png"
                alt="carta da condessa versão 3"
                width={100}
                height={130}
              />
              <Image
                src="/duque1.png"
                alt="carta do duque versão 1"
                width={100}
                height={130}
              />
              <Image
                src="/duque2.png"
                alt="carta do duque versão 2"
                width={100}
                height={130}
              />
              <Image
                src="/duque3.png"
                alt="carta do duque versão 3"
                width={100}
                height={130}
              />
              <Image
                src="/embaixador1.png"
                alt="carta do embaixador versão 1"
                width={100}
                height={130}
              />
              <Image
                src="/embaixador2.png"
                alt="carta do embaixador versão 2"
                width={100}
                height={130}
              />
              <Image
                src="/embaixador3.png"
                alt="carta do embaixador versão 3"
                width={100}
                height={130}
              />
              <Image
                src="/inquisidor1.png"
                alt="carta do inquisidor versão 1"
                width={100}
                height={130}
              />
              <Image
                src="/inquisidor2.png"
                alt="carta do inquisidor versão 2"
                width={100}
                height={130}
              />
              <Image
                src="/inquisidor3.png"
                alt="carta do inquisidor versão 3"
                width={100}
                height={130}
              />
            </ul>
          </div>
        </div>
        <div>
          <h2>Icone de cruz representando a religião católica</h2>
          <p>Retirada do site <a className="border-b border-blue-500" href="https://sellart.com.br/loja/sinete-cruz-25-mm-mod-01/">SellArt</a></p>
          <Image
            src="/catolico-icon.png"
            alt="imagem de uma cruz em um ciruclo amarelo"
            width={40}
            height={40}
          />
        </div>
        <div>
          <h2>Icone de x para fechar o menu de lobbys</h2>
          <p>Retirado do site <a className="border-b border-blue-500" href="https://www.pngwing.com/pt/free-png-bgsfr">PNGWing</a></p>
          <Image
            src="/close.png"
            alt="x"
            width={40}
            height={40}
          />
        </div>
        <div>
          <h2>Imagem de fundo da página de créditos</h2>
          <p>Retirada do site <a className="border-b border-blue-500" href="https://pt.pngtree.com/freepng/old-pirate-map-treasure-vector_8418234.html">PNGTree</a></p>
          <Image
            src="/creditos-page.png"
            alt="mapa de pirata em cima de uma mesa de madeira"
            width={130}
            height={100}
          />
        </div>
        <div>
          <h2>Icone de coroa para tornar um jogador o dono do lobby</h2>
          <p>Retirado do site <a className="border-b border-blue-500" href="https://www.flaticon.com/free-icon/crown_506431">flaticon</a></p>
          <Image
            src="/crown_player.png"
            alt="coroa"
            width={40}
            height={40}
          />
        </div>
        <div>
          <h2>Icone de menos dentro de circulo para extorquir um jogador</h2>
          <p>Retirado do site <a className="border-b border-blue-500" href="https://www.flaticon.com/free-icon/minus_262039">flaticon</a></p>
          <Image
            src="/extorquir.png"
            alt="menos dentro de circulo"
            width={40}
            height={40}
          />
        </div>
        <div>
          <h2>Imagem de guerreiros medievais indo para a batalha para o fundo da página de lobby</h2>
          <p>Retirada do site <a className="border-b border-blue-500" href="https://pt.vecteezy.com/arte-vetorial/6981149-cena-de-batalha-silhueta-com-medieval">vecteezy</a></p>
          <Image
            src="/lobby-page.png"
            alt="guerreiros medievais indo para a batalha com um castelo ao fundo"
            width={130}
            height={100}
          />
        </div>
        <div>
          <h2>Imagem de um reino para o fundo da página de login</h2>
          <p>Retirada do site <a className="border-b border-blue-500" href="https://www.freepik.com/premium-ai-image/ljubljana-dream-city-creative-illustration-ai-generate_41453662.htm">freepik</a></p>
          <Image
            src="/login-page.png"
            alt="reino"
            width={130}
            height={100}
          />
        </div>
        <div>
          <h2>Icone de menu hamburguer da página de jogo</h2>
          <p>Retirado do site <a className="border-b border-blue-500" href="https://www.pngwing.com/pt/free-png-nrzfj">pngwing</a></p>
          <Image
            src="/menu-hamburguer-icon.png"
            alt="icone de menu hamburguer"
            width={40}
            height={40}
          />
        </div>
      </main>
    </div>
  )
}