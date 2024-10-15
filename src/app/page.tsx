"use client"; // Habilita o componente do lado do cliente

import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { handleRegister } from "./actions/serverActions"; // Importa a função do servidor
import { InstagramIcon, Smartphone, Linkedin } from 'lucide-react'

export default function Home() {
  const [error, setError] = useState<string | null>(null); // Para capturar erros no cliente
  const [loading, setLoading] = useState<boolean>(false); // Para capturar erros no cliente

  async function onSubmit(formData: FormData) {
    try {
      await handleRegister(formData); // Chama a função do servidor
      // Se tudo ocorrer bem, redirecione para o dashboard
      window.location.href = "/course";
    } catch (err: any) {
      setError("Login ou senha incorretos, tente novamente"); // Captura o erro e atualiza o estado
      toast.warning(error); // Captura o erro e atualiza o estado
    }
    setLoading(!loading)
  }


  return (
    <>
      <div className={styles.containerCenter}>

        <section className={styles.login}>
          <div className={styles.esquerda}>
            <div>
              <h1>Login</h1>
              <p>Bem-vindo ao <span>plataforma do Teacher Manny</span></p>
              <p>Qualquer duvida entre em <span>contato</span></p>
              <div>
                <InstagramIcon size={25} color="#01DEB2" />
                <Smartphone size={25} color="#01DEB2" />
                <Linkedin size={25} color="#01DEB2" />
              </div>
            </div>
            <p>© 2024 Felipe Santos</p>
          </div>
          <form action={onSubmit}>
            <div>

              <p>Email</p>
              <input
                type="email"
                required
                name="email"
                className={styles.input}
              />
            </div>
            <div>
              <p>Senha</p>
              <input
                type="password"
                required
                name="password"
                className={styles.input}
              />
            </div>

            <button type="submit">{!loading ? "ENTRAR" : "CARREGANDO..."}</button>

          </form>

          {error ? <p className={styles.error}>{error}</p> : <></>}
        </section>
      </div>
    </>
  );
}
