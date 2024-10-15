"use client"

import { getCookiesClient } from '@/lib/cookieClient'
import styles from './styles.module.scss'
import { Presentation, Clock, MapPin, Hourglass } from 'lucide-react'
import { api } from '@/app/services/api'
import { useEffect, useState } from 'react'


export function EventsCard() {

  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const token = getCookiesClient();

    async function getEvents() {
      const user = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resEvents = await api.post("/course/events/list",{
        data:{
          userId: user.data.id
        }
      } ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const listEvents = resEvents.data

      setEvents(listEvents)
    }

    getEvents();
  }, []);


  return (
    <div className={styles.container}>
       {events.length > 0 ? (
        events.map((item: any) => (
          <div key={item.id} className={styles.event}>
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
        ))
      ) : (
        <p>Nenhum evento encontrado.</p>
      )}
      
    </div>
  )
}