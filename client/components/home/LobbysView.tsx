import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { newToaster } from "@utils/Toasters";

type Lobby = {
  id: number,
  quantidadePlayers: number,
  aberto: boolean
}

export default function LobbysView({
  closeView
}: {
  closeView: () => void
}) {
  const router = useRouter();
  const token = localStorage.getItem("coup-token");
  const [ loading, setLoading ] = useState(true);
  const [ lobbys, setLobbys ] = useState<Lobby[]>([]);
  const [ selected, setSelected ] = useState(-1);
  const [ name, setName ] = useState("");
  const [ senha, setSenha ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:5000/lobby");

        const lobbys = await response.json();

        setLobbys(lobbys);
      } catch (e) {
        newToaster("Não foi possível carregar os servidores");
      }

      setLoading(false);
    })();
  }, []);

  async function enter(i: number) {
    if (token === null && name.trim() === "") {
      newToaster("Coloque um nome ou faça login");
      return;
    }

    try {
      const response = token === null ?
        await fetch("http://localhost:5000/lobby/nonLogged/" + lobbys[i].id, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            name: name
          })
        })
        :
        await fetch("http://localhost:5000/lobby/" + lobbys[i].id, {
          method: "POST",
          headers: {
            Authorization: token
          }
        });

      const result: { error: string } | { lobbyId: number } = await response.json();

      if (!response.ok)
        throw new Error((result as { error: string }).error);

      router.push("/jogar/" + lobbys[i].id);
    } catch (e) {
      if (e instanceof TypeError)
        newToaster("Não foi possível criar um servidor");
      else
        newToaster("Error: " + (e as Error).message);
    }
  }

  async function create() {
    if (token === null && name.trim() === "") {
      newToaster("Coloque um nome ou faça login");
      return;
    }

    try {
      const response = token === null ?
        await fetch("http://localhost:5000/lobby/nonLogged", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            name: name
          })
        })
        :
        await fetch("http://localhost:5000/lobby", {
          method: "POST",
          headers: {
            Authorization: token
          }
        });

      const result: { error: string } | { lobbyId: number } = await response.json();

      if (!response.ok)
        throw new Error((result as { error: string }).error);

      router.push("/jogar/" + (result as { lobbyId: number }).lobbyId);
    } catch (e) {
      if (e instanceof TypeError)
        newToaster("Não foi possível criar um servidor");
      else
        newToaster("Error: " + (e as Error).message);
    }
  }

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
        <header className="bg-slate-400 p-2 flex flex-row items-center justify-between">
          <span className="font-bold text-2xl">Lobbys</span>
          <span>
            <Image
              src="/close.png"
              alt="close icon"
              width={40}
              height={40}
              className="cursor-pointer"
              onClick={closeView}
            />
          </span>
        </header>
        <div
          className="h-full p-3 flex flex-col justify-between gap-3"
        >
          <div
            className="w-full h-full bg-white rounded-lg overflow-auto"
            id="table-container"
          >
            {loading ?
              <Loading />
              :
              <Servers
                lobbys={lobbys}
                selected={selected}
                select={setSelected}
                enter={enter}
              />
            }
          </div>
          <div className="w-full flex justify-around">
            {token === null &&
              <input
                className="rounded-lg pl-2"
                placeholder="Nome"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            }
            <button
              className={`${selected !== -1 ? "bg-lime-500" : "bg-gray-400 cursor-default"} border-none rounded-lg text-white text-2xl font-bold py-1 px-2`}
              onClick={() => selected !== -1 && enter(selected)}
            >
              Entrar
            </button>
            <button
              className="bg-orange-400 border-none rounded-lg text-white text-2xl font-bold py-1 px-2"
              onClick={() => create()}
            >
              Criar
            </button>
            {selected !== -1 && !lobbys[selected].aberto &&
              <input
                className="rounded-lg pl-2"
                placeholder="Senha"
                type="text"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function Servers({
  lobbys,
  selected,
  select,
  enter
}: {
  lobbys: Lobby[],
  selected: number,
  select: (i: number) => void,
  enter: (i: number) => void
}) {
  function tdCss(i: number) {
    if (selected === i)
      return " lobbys_table_td_selected";

    if (i%2 === 0)
      return " lobbys_table_td_even";

    return "";
  }

  return (
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
            key={lobby.id}
            onClick={() => select(i)}
            onDoubleClick={() => enter(i)}
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
  )
}

function Loading() {
  return (
    <>
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
    </>
  )
}