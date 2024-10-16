"use client"

import Link from 'next/link'
import styles from './styles.module.scss'
import styless from './hamburgers.module.css'
import Image from 'next/image'

import { usePathname } from "next/navigation";
// import logoImg from '/public/Logo.svg'
import { LogOutIcon,SlidersVertical , BookOpen, CalendarDays, LayoutDashboard, Gamepad } from 'lucide-react'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getCookiesClient } from '@/lib/cookieClient';
import { api } from '@/app/services/api';
import { useEffect, useState } from 'react';


interface User {
  name: string;
  email: string;
  adm: boolean;
  photourl: string;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
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
      try {
        const response = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUrlUser(response.data.photourl);
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao carregar o usuário:", error);
        handleLogout(); // Redireciona se houver erro
      }
    }

    getUser();
  }, []);

  // if(user){
  //   console.log(user)
  // }

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

            <Link className={isActive("/dashboard") ? styles.active : styles.link} href="/dashboard">
              <LayoutDashboard size={24} color='#FFFF' />
            </Link>

            <Link className={isActive("/game") ? styles.active : styles.link} href="/game">
              <Gamepad size={24} color='#FFFF' />
            </Link>

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


        {user && user.adm && <Link className={isActive("/adm") ? styles.active : styles.link} href="/adm">
            <SlidersVertical size={24} color='#FFFF' />
          </Link>}

          <Link className={isActive("/dashboard") ? styles.active : styles.link} href="/dashboard">
            <LayoutDashboard size={24} color='#FFFF' />
          </Link>

          <Link className={isActive("/game") ? styles.active : styles.link} href="/game">
              <Gamepad size={24} color='#FFFF' />
            </Link>
            
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