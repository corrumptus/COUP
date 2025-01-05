import Image from "next/image"

export default function HamburgerIcon({
  isOpened,
  change
}: {
  isOpened: boolean,
  change: () => void
}) {
  return (
    <button className="h-[40px] relative">
      <Image
        src="/x-icon.png"
        alt="icone de x"
        width={40}
        height={40}
        className={`${isOpened ? "opacity-100" : "opacity-0"} transition-opacity duration-700 ease-linear`}
        onClick={change}
      />
      <Image
        src="/menu-hamburguer-icon.png"
        alt="icone de menu hamburguer"
        width={40}
        height={40}
        className={`${isOpened ? "opacity-0" : "opacity-100"} transition-opacity duration-700 ease-linear absolute top-[3px]`}
        onClick={change}
      />
    </button>
  )
}