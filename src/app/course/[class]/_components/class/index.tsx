"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { CircleCheckBig } from "lucide-react";
import { getCookiesClient } from "@/lib/cookieClient";
import { api } from "@/app/services/api";
import { Button3 } from "@/app/components/button3";

interface Courses {
  id: string;
  title: string;
  content: any;
  createdAt: string;
  courseId: string;
  progress: any;
}

interface Props {
  course_id: string;
  user_id: string
}

export function ClassContainer({ course_id, user_id }: Props) {
  const [classes, setClasses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(true);
  const token = getCookiesClient();

  useEffect(() => {
    async function fetchLessons() {
      try {
        setLoading(true);
        const responseClass = await api.post<Courses[]>("/course/lessonbyid", {
          course_id: course_id,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(responseClass.data)

        setClasses(responseClass.data); // Atualiza o estado com as aulas recebidas
      } catch (error) {
        console.error("Erro ao carregar as aulas", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [course_id, token]);

  if (loading) {
    return <div className={styles.content}>
      <div className={styles.div}>
        <p>Carregando...</p>
      </div>
    </div>; // Mostra um indicador de carregamento enquanto os dados são buscados
  }

  return (
    <div className={styles.content}>
      {classes.map((item:any) => (
        <Link key={item.id} href={`/course/${course_id}/${item.id}`}>
          <div className={styles.div}>
            <p>{item.title}</p>
            {/* <Button3
              user_id={user_id}
              lesson_id={item.id}
              progress={item.progress}
            /> */}
          </div>
        </Link>
      ))}
    </div>
  );
}
