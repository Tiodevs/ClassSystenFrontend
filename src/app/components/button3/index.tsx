"use client"

import styles from './styles.module.scss'
import { useFormStatus } from 'react-dom'

import { Check } from 'lucide-react'
import { api } from '@/app/services/api'
import { getCookiesClient } from '@/lib/cookieClient'

interface Props {
  user_id: string,
  progress: any,
  lesson_id: string
}

export function Button3({ user_id, progress, lesson_id }: Props) {
  const { pending } = useFormStatus();

  const filterProgress = progress.filter((item: any) => item.userId === user_id)

  async function editProgress() {
    const token = getCookiesClient()

    await api.post('/course/progress/edit', {
      lesson_id: filterProgress[0].id
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await api.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(user.data.Streak)

    if(user.data.Streak?.length > 0){
      await api.put('/user/streak', {
        userId: user_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } else{
      await api.post('/user/streak', {
        user_id: user_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

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

    const user = await api.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if(user.data.Streak?.length > 0){
      await api.put('/user/streak', {
        userId: user_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } else{
      await api.post('/user/streak', {
        user_id: user_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Atualiza a página após a requisição ser completada
    window.location.reload();

  }

  return (

    <div>
      {filterProgress.length === 0 ?
        <button onClick={() => createProgress()} disabled={pending} className={styles.button}>
          MARCAR COMO FEITO
        </button>
        : !filterProgress[0].completed ?
        <button onClick={() => editProgress()} disabled={pending} className={styles.button}>
          MARCAR COMO FEITO
        </button>
        : <button onClick={() => editProgress()} disabled={pending} className={styles.button}>
  
        AULA FEITA
        <Check size={24} className={styles.icon} color="#0A0A0A" />
      </button>}
    </div>

  )
}