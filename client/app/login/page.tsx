"use client"

import { useRouter } from "next/navigation";
import Form from "../components/loginForm/Form";

export default function Login() {
  const router = useRouter();

  async function clickHandler(name: string, password: string) {
    if (!name || name.trim() === "") {
      alert("Error: Invalid username");
      return;
    }

    if (!password || password.trim() === "") {
      alert("Error: Invalid password");
      return;
    }

    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      body: JSON.stringify({ name: name, password: password })
    });

    const infos = await response.json();

    if (response.status !== 200)
      alert("Error: " + infos.error);
    else {
      localStorage.setItem("coup-token", infos.token);
      router.push("/");
    }
  }

  return (
    <div className="h-full bg-[url(../public/login-page.png)] bg-bottom bg-no-repeat bg-cover flex flex-col items-center justify-center">
      <Form
        type="Entrar"
        loginHandler={clickHandler}
      />
    </div>
  )
}