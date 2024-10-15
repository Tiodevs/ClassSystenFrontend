"use client"

import styles from './styles.module.scss'
import { useFormStatus } from 'react-dom'

import { LockKeyhole, Check, X } from 'lucide-react'
import { api } from '@/app/services/api'
import { getCookiesClient } from '@/lib/cookieClient'
import { useState, useEffect } from 'react'

interface Props {
  user_id: string,
  progress: any,
  lesson_id: string
}

export function Button3({ user_id, progress, lesson_id }: Props) {
  const { pending } = useFormStatus();

  const filterProgress = progress.filter((item: any) => item.userId === user_id)

  console.log("user?" , user_id)
  console.log("progess?" , progress)
  async function editProgress() {
    const token = getCookiesClient()

    await api.post('/course/progress/edit', {
      lesson_id: filterProgress[0].id
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Atualiza a página após a requisição ser completada
    window.location.reload();

  }

  async function createProgress() {
    const token = getCookiesClient()

    await api.post('/course/progress', {
      completed: true,
      user_id: user_id,
      lesson_id: lesson_id

    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Atualiza a página após a requisição ser completada
    window.location.reload();

  }

  return (

    <div>
      {filterProgress.length === 0 ?
        <button onClick={() => createProgress()} disabled={pending} className={styles.button}>
          MARCAR COMO FEITO
          <LockKeyhole size={24} color="#FF0B0B" className={styles.icon}/>
        </button>
        : filterProgress[0].completed ?
        <button onClick={() => editProgress()} disabled={pending} className={styles.button}>
          MARCAR COMO FEITO
          <X size={24} color="#FF0B0B" className={styles.icon}/>
          
        </button>
        : <button onClick={() => editProgress()} disabled={pending} className={styles.button}>
  
        AULA FEITA
        <Check size={24} className={styles.icon} color="#0A0A0A" />
      </button>}
    </div>

  )
}