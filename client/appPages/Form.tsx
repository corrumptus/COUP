import Link from "next/link";
import { useState } from "react";
import FormInput from "@components/form/FormInput";

export default function Form({
  type,
  loginHandler
}: {
  type: "Entrar" | "Inscrever-se",
  loginHandler: (name: string, password: string, confirmPassword?: string) => void
}) {
  const [ name, setName ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ cPassword, setCPassword ] = useState("");

  const formClassName: string = `bg-[#afafaf]/5 backdrop-blur-xl flex flex-col
  items-center justify-center border border-white/20 p-6 rounded-3xl gap-3`;

  if (type === "Entrar") return (
    <form
      className={formClassName + " text-black"}
      onSubmit={e => {
        e.preventDefault();

        loginHandler(name, password);
      }}
    >
      <h1 className="text-4xl font-bold">Entrar</h1>
      <FormInput
        value={name}
        changeValue={name => setName(name)}
        label="Nome"
      />
      <FormInput
        value={password}
        changeValue={password => setPassword(password)}
        isPassword
        label="Senha"
      />
      <button
        className="bg-white text-black w-full py-1.5 rounded-3xl mt-2"
      >Entrar</button>
      <div className="flex gap-1.5">
        Não está cadastrado? 
        <Link
          href="/sign-up"
          className="font-bold"
        >Inscreva-se</Link>
      </div>
    </form>
  );

  return (
    <form
      className={formClassName + " text-white"}
      onSubmit={e => {
        e.preventDefault();

        loginHandler(name, password, cPassword);
      }}
    >
      <h1 className="text-4xl font-bold">Inscrever-se</h1>
      <FormInput
        value={name}
        changeValue={name => setName(name)}
        label="Nome"
      />
      <FormInput
        value={password}
        changeValue={password => setPassword(password)}
        isPassword
        label="Senha"
      />
      <FormInput
        value={cPassword}
        changeValue={cPassword => setCPassword(cPassword)}
        isPassword
        label="Confirmar Senha"
      />
      <button
        className="bg-white text-black w-full py-1.5 rounded-3xl mt-2"
      >Inscrever-se</button>
      <div className="flex gap-1.5">
        Já está cadastrado? 
        <Link
          href="/login"
          className="font-bold"
        >Entrar</Link>
      </div>
    </form>
  );
}