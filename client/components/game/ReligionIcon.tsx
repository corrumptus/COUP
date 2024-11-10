import Image from "next/image";
import { Religion } from "@type/game";

export default function ReligionIcon({
  religion,
  className
}: {
  religion: Religion,
  className?: string
}) {
  return religion === Religion.CATOLICA ?
    <Image
      src="/catolico-icon.png"
      alt="cruz católica"
      title="católico"
      className={className}
      width={40}
      height={40}
    />
    :
    <Image
      src="/protestante-icon.png"
      alt="biblia"
      title="protestante"
      className={className}
      width={40}
      height={40}
    />
}