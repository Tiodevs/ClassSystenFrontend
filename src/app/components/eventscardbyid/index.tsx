"use client"

import { getCookiesClient } from '@/lib/cookieClient'
import styles from './styles.module.scss'
import { Presentation, Clock, MapPin, Hourglass, Trash } from 'lucide-react'
import { api } from '@/app/services/api'
import { useEffect, useState } from 'react'

interface Props {
  userId: string
}

export function EventsCardById({ userId }: Props) {

  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const token = getCookiesClient();


    setEvents([])

    async function getEvents() {

      const resEvents = await api.post("/course/events/list", {
        data: {
          userId
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const listEvents = resEvents.data

      const filterEvents = listEvents.filter((item: any) => item.userId === userId)

      setEvents(filterEvents)
    }

    getEvents();
  }, []);

  async function handleDeleteLesson(event_id: any) {

    const token = getCookiesClient()

    await api.delete("/course/events", {
      params: {
        event_id: event_id
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .catch((err) => {
        console.log(err)
        return
      })

    setTimeout(() => {
      window.location.reload();
    }, 1000); // Recarrega a página após 2 segundos
  }


  return (
    <div className={styles.container}>
      {events.length > 0 ? (
        events.map((item: any) => (
          <div key={item.id} className={styles.event}>
            <div className={styles.direita}>
              <div className={styles.iconevent}>
                <Presentation size={32} color="#121C2C" />
              </div>
              <div className={styles.infoevent}>
                <h2>{item.title}</h2> {/* Título dinâmico */}
                <div className={styles.infoevent2}>
                  <div>
                    <Clock size={17} color="#8F8F8F" />
                    <p>{item.date}</p> {/* Data dinâmica */}
                  </div>
                  <div>
                    <MapPin size={17} color="#8F8F8F" />
                    <p>{item.place}</p> {/* Local dinâmico */}
                  </div>
                  <div>
                    <Hourglass size={17} color="#8F8F8F" />
                    <p>{item.duration}</p> {/* Duração dinâmica */}
                  </div>
                </div>
              </div>
            </div>

            <Trash size={27} color="#FFFF" onClick={() => handleDeleteLesson(item.id)} className={styles.btndelete} />

          </div>
        ))
      ) : (
        <div className={styles.event}>
          <p>Nenhum evento encontrado.</p>
        </div>
      )}

    </div>
  )
}