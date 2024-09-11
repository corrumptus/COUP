import { COUPSocket } from "@/utils/socketAPI";
import Image from "next/image";

export default function Player({
  name,
  canEdit,
  isOwner,
  isUser,
  socket
}: {
  name: string,
  canEdit: boolean,
  isOwner: boolean,
  isUser: boolean,
  socket: COUPSocket
}) {
  function getNameColor() {
    if (isOwner)
      return " text-[#ff0000]";

    if (isUser)
      return " text-[#0d9b0d]";

    return "";
  }

  return (
    <li className="flex items-center gap-2 border-b border-[#4f4f4f] pt-px">
      <span className={`text-2xl flex-1 text-ellipsis overflow-hidden whitespace-nowrap${getNameColor()}`}>{name}</span>
      {canEdit && !isOwner &&
        <div className="flex gap-1.5 w-max">
          <Image
            src="/crown_player.png"
            alt="uma coroa"
            width={40}
            height={40}
            className="cursor-pointer w-[28px] h-[28px] phone/2:w-[34px] phone/2:h-[34px] pc-2:w-[40px] pc-2:h-[40px]"
            title="torna o player dono do jogo"
            onClick={() => socket.emit("newOwner", name)}
          />
          <Image
            src="/remove_player.png"
            alt="um x"
            width={40}
            height={40}
            className="cursor-pointer w-[28px] h-[28px] phone/2:w-[34px] phone/2:h-[34px] pc-2:w-[40px] pc-2:h-[40px]"
            title="remove o player do jogo"
            onClick={() => socket.emit("removePlayer", name)}
          />
        </div>
      }
    </li>
  )
}