"use client"

import styles from './styles.module.scss'
import { useFormStatus } from 'react-dom'
import { Redirect } from 'next'
import { useRouter } from 'next/navigation';
import { Wrench } from "lucide-react";


interface Props {
  event: number,
  userId?: string
}

export function Button4({ event, userId }: Props) {
  const { pending } = useFormStatus();

  const router = useRouter();

  function redirect() {
    if (event === 1) {
      router.push(`/adm/${userId}`)
    }

    return
  }

  return (
    <button onClick={redirect} disabled={pending} type='submit' className={styles.button}>
      <Wrench
        size={24}
        color="#01C790"
      />
    </button>
  )
}