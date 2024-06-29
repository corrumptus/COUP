import Image from "next/image";
import { DEFAULT_SOCKET_URL, useSocket } from "@utils/socketAPI";

export default function Player({ name, canEdit }: { name: string; canEdit: boolean; }) {
  const socket = useSocket(DEFAULT_SOCKET_URL);
  
  return (
    <li className="flex items-center gap-2 border-b border-[#4f4f4f] pt-px">
      <span className="text-lg flex-1 text-ellipsis overflow-hidden whitespace-nowrap">{name}</span>
      {canEdit &&
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