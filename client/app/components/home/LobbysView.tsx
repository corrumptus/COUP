import Lobby from "@/app/entitys/Lobby";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react"

export default function LobbysView({
  closeView
}: {
  closeView: () => void
}) {
  return (
    <div
      className="h-full w-full flex items-center justify-center absolute bg-slate-800/40"
      id="lobbys-view"
      onClick={e => {
        if ((e.target as HTMLDivElement).id !== "lobbys-view")
          return;

        closeView();
      }}
    >
      <div
        className="h-[90%] w-[92%] rounded-2xl overflow-hidden flex flex-col bg-slate-300"
        id="lobbys-container"
      >
        <header className="bg-slate-400 px-3 py-2 flex flex-row justify-between">
          <span className="font-bold text-[2em]">Lobbys</span>
          <span>
            <Image
              src="/close.png"
              alt="close icon"
              width={50}
              height={50}
              className="cursor-pointer"
              onClick={closeView}
            />
          </span>
        </header>
        <Suspense fallback={<Loading />}>
          <LobbyRepresentation />
        </Suspense>
      </div>
    </div>
  )
}

async function LobbyRepresentation() {
  const router = useRouter();
  // const lobbys: Lobby[] = await (await fetch("http://localhost:5000/lobby")).json();
  const [ lobbys ] = useState<Lobby[]>([
    {id: 1, quantidadePlayers: 1, aberto: false},
    {id: 1, quantidadePlayers: 1, aberto: false},
    {id: 1, quantidadePlayers: 1, aberto: false},
    {id: 1, quantidadePlayers: 1, aberto: false},
  ]);
  const [ selected, setSelected ] = useState(-1);
  
  const tdCss = (i: number) => selected === i ?
    " lobbys_table_td_selected"
    :
    i%2 === 0 ? " lobbys_table_td_even" : "";

  function handleClick(i: number) {
    setSelected(i);
  }

  function handleDClick(i: number) {
    setSelected(i);
    router.push("/jogar/" + lobbys[i].id);
  }

  return (
    <>
      <div
        className="h-full mt-4 mx-6 bg-white rounded-lg overflow-auto"
        id="table-container"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="lobbys_table_th">ID</th>
              <th className="lobbys_table_th">Players</th>
              <th className="lobbys_table_th">Aberto</th>
            </tr>
          </thead>
          <tbody>
            {lobbys.map((lobby, i) =>
              <tr
                onClick={() => handleClick(i)}
                onDoubleClick={() => handleDClick(i)}
              >
                <td className={`lobbys_table_td${tdCss(i)}`}>
                  {lobby.id}
                </td>
                <td className={`lobbys_table_td${tdCss(i)}`}>
                  {lobby.quantidadePlayers}
                </td>
                <td className={`lobbys_table_td${tdCss(i)}`}>
                  {lobby.aberto ? "sim" : "não"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-center p-2">
        <button
          className={`${selected !== -1 ? "bg-lime-500" : "bg-gray-400 cursor-default"} border-none rounded-lg text-white text-2xl font-bold py-1 px-2`}
        >
          Entrar
        </button>
      </div>
    </>
  );
}

function Loading() {
  return (
    <div
      className="h-full my-4 mx-6 bg-white rounded-lg overflow-auto"
      id="table-container"
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="lobbys_table_th">ID</th>
            <th className="lobbys_table_th">Players</th>
            <th className="lobbys_table_th">Aberto</th>
          </tr>
        </thead>
      </table>
      <div className="loading_height flex items-center justify-center">
        <p>Loading...</p>
      </div>
    </div>
  );
}