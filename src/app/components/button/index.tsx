"use client"

import styles from './styles.module.scss'
import { useFormStatus } from 'react-dom'

import { LockKeyhole, Check } from 'lucide-react'
import { api } from '@/app/services/api'
import { getCookiesClient } from '@/lib/cookieClient'

interface Props {
  name: any,
  user_id: any
}

export function Button({ name, user_id }: Props) {
  const { pending } = useFormStatus();

  async function editUser(id: any) {
    const token = getCookiesClient()

    await api.post('/users/edit', {
      user_id: id
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Atualiza a página após a requisição ser completada
    window.location.reload();

  }

  return (
    <button onClick={() => editUser(user_id)} disabled={pending} className={styles.button}>
      {!name ? <LockKeyhole size={24} color="#FF0B0B" /> : <Check size={24} color="#01C790" />}
    </button>
  )
}