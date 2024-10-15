"use client"

import Link from 'next/link'
import styles from './styles.module.scss'
import styless from './hamburgers.module.css'
import Image from 'next/image'

import { usePathname } from "next/navigation";
// import logoImg from '/public/Logo.svg'
import { LogOutIcon, BookOpen, CalendarDays } from 'lucide-react'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getCookiesClient } from '@/lib/cookieClient';
import { api } from '@/app/services/api';
import { useEffect, useState } from 'react';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [urlUser, setUrlUser] = useState("");
  const [isactive, setIsactive] = useState(false);

  const router = useRouter();


  // Verifica se a rota é ativa
  const pathname = usePathname(); // Pega a rota ativa
  const isActive = (path: string) => pathname.startsWith(path);

  async function handleLogout() {
    deleteCookie("session", { path: "/" })
    toast.success("Logout feito com sucesso!")

    router.replace("/")
  }

  useEffect(() => {
    const token = getCookiesClient();

    async function getUser() {
      const response = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseUrl = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resListUsers = responseUrl.data

      const usersURL = resListUsers.filter((item: any) => item.id === response.data.id)

      setUrlUser(usersURL[0].photourl)
      setUser(response.data); // Atualizamos o estado com os dados do usuário
    }

    getUser();
  }, []);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard">
          <Image
            alt="Logo Sujeito Pizza"
            src={"/logoPSILT2.svg"}
            width={98}
            height={54}
            priority={true}
            quality={100}
          />
        </Link>

        <button onClick={() => setIsactive(!isactive)} className={`${styless.hamburger} ${isactive ? styless.isactive : ""} ${styless.hamburgerspin} ${styles.btnnav}`}>
          <div className={styless.hamburgerbox}>
            <div className={styless.hamburgerinner}></div>
          </div>
        </button>

        <nav className={`${isactive ? styles.isactive : ""} ${styles.navmobi}`}>

          <div className={styles.navlink}>

            <Link className={isActive("/course") ? styles.active : styles.link} href="/course">
              <BookOpen size={24} color='#FFFF' />
            </Link>

            <Link className={isActive("/events") ? styles.active : styles.link} href="/events">
              <CalendarDays size={24} color="#FFFF" />
            </Link>

            <button className={styles.link} onClick={() => handleLogout()}>
              <LogOutIcon size={24} color="#FFFF" />
            </button>
          </div>


          <div>

            <Image
              alt="Logo Sujeito Pizza"
              src={urlUser}
              width={40}
              height={40}
              priority={true}
              quality={100}
              className={styles.imgPerson}
            />
          </div>


        </nav>

        <nav className={styles.nav}>
          <Link className={isActive("/course") ? styles.active : styles.link} href="/course">
            <BookOpen size={24} color="#121C2C" />
          </Link>

          <Link className={isActive("/events") ? styles.active : styles.link} href="/events">
            <CalendarDays size={24} color="#121C2C" />
          </Link>

          <button className={styles.link} onClick={() => handleLogout()}>
            <LogOutIcon size={24} color="#121C2C" />
          </button>


          <Image
            alt="Logo Sujeito Pizza"
            src={urlUser}
            width={40}
            height={40}
            priority={true}
            quality={100}
            className={styles.imgPerson}
          />

          {/* {user ? (
            <p className={styles.name}>{user.name}</p>
          ) : <p>Carregando</p>} */}

        </nav>
      </div>
    </header>
  )
}