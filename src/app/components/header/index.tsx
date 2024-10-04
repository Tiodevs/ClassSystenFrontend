"use client"

import Link from 'next/link'
import styles from './styles.module.scss'
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

  const router = useRouter();

  // Verifica se a rota é ativa
  const pathname = usePathname(); // Pega a rota ativa
  const isActive = (path: string) => pathname === path;

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

        <nav>
          <Link className={isActive("/course") ? styles.active : styles.link} href="/course">
            <BookOpen size={24} color="#121C2C" />
          </Link>

          <Link className={isActive("/course/calender") ? styles.active : styles.link} href="/course/calender">
            <CalendarDays size={24} color="#121C2C" />
          </Link>

          <button className={isActive("/") ? styles.active : styles.link} onClick={() => handleLogout()}>
            <LogOutIcon size={24} color="#121C2C" />
          </button>
          
          {user && (
            <p className={styles.name}>{user.name}</p>
          )}

          <Image
            alt="Logo Sujeito Pizza"
            src={"/profile.png"}
            width={40}
            height={40}
            priority={true}
            quality={100}
          />

        </nav>
      </div>
    </header>
  )
}