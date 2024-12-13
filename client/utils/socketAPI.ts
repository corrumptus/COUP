import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import COUPDefaultConfigs from "@utils/COUPDefaultConfigs.json";
import { objectDiff } from "@utils/utils";
import type Config from "@type/config";
import type { COUPSocket } from "@type/socket";
import type { Differ } from "@type/utils";

export default function useSocket(id?: string) {
  const [ error, setError ] = useState<string | undefined>("Loading...");
  const socketRef = useRef<COUPSocket | undefined>(undefined);

  useEffect(() => {
    function onUnload() {
      socketRef.current = undefined;
    }

    window.addEventListener("unload", onUnload);

    return () => {
      window.removeEventListener("unload", onUnload);
    }
  }, []);

  useEffect(() => {
    if (socketRef.current !== undefined)
      return;

    if (
      localStorage.getItem("coup-token") === null
      &&
      sessionStorage.getItem("coup-name") === null
      &&
      localStorage.getItem("coup-sessionCode") === null
    ) {
      setError("O usuário deve estar logado ou possuir um nome");
      return;
    }

    if (
      id !== undefined
      &&
      Number.isNaN(Number(id))
    ) {
      setError("Lobby inválido");
      return;
    }

    const lobby = id === undefined ? undefined : Number(id);

    let auth: any;

    if (localStorage.getItem("coup-sessionCode") !== null)
      auth = {
        sessionCode: localStorage.getItem("coup-sessionCode")
      }
    else if (localStorage.getItem("coup-token") !== null)
      auth = {
        token: localStorage.getItem("coup-token"),
        lobby: lobby
      }
    else
      auth = {
        name: sessionStorage.getItem("coup-name"),
        lobby: lobby
      }

    if (sessionStorage.getItem("coup-lobbyPassword") !== null)
      auth["password"] = sessionStorage.getItem("coup-lobbyPassword");

    socketRef.current = 
      (io("http://localhost:5000", {
        auth: auth
      }) as COUPSocket)
        .on("disconnectReason", (reason) => {
          setError(reason);
        })
        .on("disconnect", () => {
          localStorage.removeItem("coup-sessionCode");
          setError(err => err === undefined ? "Não foi possível se conectar ao servidor" : err);
        });

    setError(undefined);
  }, []);

  if (error !== undefined)
    return { error: error };

  return { socket: socketRef.current as COUPSocket };
}

export function configDiff(configs: Config): Differ<Config> {
  return objectDiff(COUPDefaultConfigs, configs);
}