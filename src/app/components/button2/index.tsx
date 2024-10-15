"use client"

import styles from './styles.module.scss'
import { useFormStatus } from 'react-dom'
import { Redirect } from 'next'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCookiesClient } from '@/lib/cookieClient';


interface Props {
  name: string,
  event: number,
  courseid?: string, // Função opcional
  userId?: string, // Função opcional
}

export function Button2({ name, event, courseid, userId  }: Props) {
  const { pending } = useFormStatus();

  const router = useRouter();

  const token = getCookiesClient()

  function redirect() {
    switch (event) {
      case 1:
        router.push(`/adm/usercourses/${userId}`);
        break;
      case 2:
        router.push('/adm/createcourse');
        break;
      case 3:
        router.push('/adm/signup');
        break;
      case 4:
        router.push(`/adm/createlesson/${courseid}`);
        break;
      case 5:
        router.push(`/adm/createevent/${userId}`);
        break;
      case 6:
        router.back();
        break;
      
      default:
        console.warn("Evento desconhecido");
    }
  }

  function handleCustomFunction() {
    console.log("Arquivado");
  }

  return (
    <button onClick={redirect} disabled={pending} type='submit' className={styles.button}>
      {pending ? "Carregando..." : name}
      <Image
        src={"/ARROW.svg"}
        alt="Logo da empresa"
        className={styles.logo}
        width={16}
        height={16}
      />
    </button>
  )
}