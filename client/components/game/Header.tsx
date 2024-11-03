import Image from "next/image"

export default function Header({
  leave,
  children
}: {
  leave: () => void,
  children?: JSX.Element
}) {
  return (
    <header className="flex justify-between text-2xl gap-2 p-1.5 pr-2 bg-[#eaaf73]">
      <button
        className="flex items-center gap-3 cursor-pointer"
        onClick={leave}
      >
        <Image
          src="/sair-lobby.png"
          alt="seta para a esquerda"
          className="hover:drop-shadow-lg"
          width={40}
          height={40}
        />
        <span>Sair</span>
      </button>
      {children !== undefined &&
        children
      }
    </header>
  )
}