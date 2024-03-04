import { useRouter } from "next/navigation"
import FormInput from "./FormInput";
import { useRef } from "react";

export default function Form({
  type,
  clickHandler
}: {
  type: "Entrar" | "Inscrever-se",
  clickHandler: (name: string, password: string, confirmPassword?: string) => void
}) {
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const cPasswordRef = useRef<HTMLInputElement>(null);

  const formClassName: string = `bg-[#afafaf]/5 backdrop-blur-xl flex flex-col
  items-center justify-center border border-white/20 p-6 rounded-3xl gap-3`;

  if (type === "Entrar") return (
    <form className={formClassName + " text-black"}>
      <h1 className="text-4xl font-bold">{type}</h1>
      <FormInput
        text="Nome"
        ref={nameRef}
      />
      <FormInput
        text="Senha"
        isPassword
        ref={passwordRef}
      />
      <button
        className="bg-white text-black w-full py-1.5 rounded-3xl mt-2"
        onClick={() => clickHandler(
          nameRef.current?.value || "",
          passwordRef.current?.value || ""
        )}
      >Entrar</button>
      <div className="flex gap-1.5">
        Não está cadastrado? 
        <button
          onClick={() => router.push("/sign-up")}
          className="font-bold"
        >Inscreva-se</button>
      </div>
    </form>
  );

  return (
    <form className={formClassName + " text-white"}>
      <h1 className="text-4xl font-bold">{type}</h1>
      <FormInput
        text="Nome"
        ref={nameRef}
      />
      <FormInput
        text="Senha"
        isPassword
        ref={passwordRef}
      />
      <FormInput
        text="Confirmar Senha"
        isPassword
        ref={cPasswordRef}
      />
      <button
        className="bg-white text-black w-full py-1.5 rounded-3xl mt-2"
        onClick={() => clickHandler(
          nameRef.current?.value || "",
          passwordRef.current?.value || "",
          cPasswordRef.current?.value
        )}
      >Inscrever-se</button>
      <div className="flex gap-1.5">
        Já está cadastrado? 
        <button
          onClick={() => router.push("/login")}
          className="font-bold"
        >Entrar</button>
      </div>
    </form>
  );
}