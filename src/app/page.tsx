"use client"; // Habilita o componente do lado do cliente

import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { handleRegister } from "./actions/serverActions"; // Importa a função do servidor

export default function Home() {
  const [error, setError] = useState<string | null>(null); // Para capturar erros no cliente

  async function onSubmit(formData: FormData) {
    try {
      await handleRegister(formData); // Chama a função do servidor
      // Se tudo ocorrer bem, redirecione para o dashboard
      window.location.href = "/course";
    } catch (err: any) {
      setError("Login ou senha incorretos, tente novamente"); // Captura o erro e atualiza o estado
    }
  }

  // Exibe o toast de erro no cliente
  if (error) {
    toast.warning(error);
  }

  return (
    <>
      <div className={styles.containerCenter}>
        <Image
          src={"/logo.svg"}
          alt="Logo da empresa"
          className={styles.logo}
          width={10}
          height={80}
          priority
        />

        <section className={styles.login}>
          <h1 className={styles.titleLogin}>Login</h1>
          <form action={onSubmit}>
            <input
              type="email"
              required
              name="email"
              placeholder="Email"
              className={styles.input}
            />

            <input
              type="password"
              required
              name="password"
              placeholder="Senha"
              className={styles.input}
            />

            <button type="submit">Entrar</button>
          </form>

          {error ? <p className={styles.error}>{error}</p>: <></>}
        </section>
      </div>
    </>
  );
}
