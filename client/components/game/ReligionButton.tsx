import Image from "next/image";
import { MouseEventHandler } from "react";
import { Religion } from "@type/game";

export default function ReligionButton({
  religion,
  onClick,
  className
}: {
  religion: Religion,
  onClick?: MouseEventHandler<HTMLImageElement>,
  className?: string
}) {
  return religion === Religion.CATOLICA ?
    <Image
      src="/catolico-icon.png"
      alt="cruz católica"
      title="católico"
      className={className}
      onClick={onClick}
      width={40}
      height={40}
    />
    :
    <Image
      src="/protestante-icon.png"
      alt="biblia"
      title="protestante"
      className={className}
      onClick={onClick}
      width={40}
      height={40}
    />
}