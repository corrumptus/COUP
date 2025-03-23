import Image from "next/image";
import { Religion } from "@type/game";

export default function ReligionIcon({
  religion
}: {
  religion: Religion
}) {
  return religion === Religion.CATOLICA ?
    <Image
      src="/catolico-icon.png"
      alt="cruz católica"
      title="católico"
      width={40}
      height={40}
    />
    :
    <Image
      src="/protestante-icon.png"
      alt="biblia"
      title="protestante"
      width={40}
      height={40}
    />
}