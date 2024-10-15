// pages/adm.tsx
"use client"

import { getCookiesServer } from "@/lib/cookieServer";
import { Header } from "../components/header";
import { Title } from "../components/title";
import Image from "next/image";
import { Trash } from "lucide-react";

import styles from "./styles.module.scss";
import { api } from "../services/api";
import { Button } from "../components/button";
import { Button2 } from "../components/button2";
import { Button4 } from "../components/button4";
import { useEffect, useState } from "react";
import { getCookiesClient } from "@/lib/cookieClient";

// Tipagem para os dados de usuário e curso
interface User {
  id: string;
  name: string;
  email: string;
  photourl: string;
  active: boolean;
  courses: { courseId: string; course: { name: string } }[];
}

interface Course {
  id: string;
  name: string;
  active: boolean;
  lessons: { id: string; title: string }[];
}

export default function Adm() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookiesClient();

        const usersResponse = await api.get("users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const coursesResponse = await api.get("/course", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(usersResponse.data);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleArchive = async (courseId: string) => {
    try {
      const token = getCookiesClient();
      await api.post(
        "/course/edit",
        { course_id: courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`Curso ${courseId} arquivado`);
      window.location.reload()
    } catch (error) {
      console.error("Erro ao arquivar o curso:", error);
    }
  };

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <header className={styles.header}>
          <Title
            name01="Configure toda a plataforma por aqui"
            name02="Painel de administrador"
          />
          <div className={styles.btnActions}>
            <Button2 name="CRIAR USER" event={3} />
            <Button2 name="CRIAR CURSO" event={2} />
          </div>
        </header>

        <div className={styles.content}>
          {users.map((user) => (
            <div key={user.id} className={styles.teste}>
              <div className={styles.person}>
                <div className={styles.infoPerson}>
                  <Image
                    src={user.photourl}
                    alt="Foto do usuário"
                    className={styles.logo}
                    width={78}
                    height={78}
                    priority
                  />
                  <div>
                    <h2>{user.name}</h2>
                    <div className={styles.infoCursePerson}>
                      <p>{user.email}</p>
                      <p> • </p>
                      {user.courses?.length > 0 ? (
                        user.courses.map((course) => (
                          <p key={course.courseId}>{course.course.name},</p>
                        ))
                      ) : (
                        <p>Sem cursos</p>
                      )}
                      <p> • </p>
                      <p>Ativo: {user.active ? "true" : "false"}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.btns}>
                  <Button4 event={1} userId={user.id} />
                  <Button name={user.active.toString()} user_id={user.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.content2}>
          {courses.map((course) => (
            <div key={course.id}>
              <div className={styles.headercourse}>
                <h1 className={styles.title}>{course.name}</h1>
                <div className={styles.btncourses}>
                  <Button2 name="CRIAR AULA" event={4} courseid={course.id} />
                  <button
                    onClick={() => handleArchive(course.id)}
                    type="submit"
                    className={styles.btnArquivar}
                  >
                    {course.active? "ARQUIVAR CURSO": "DESARQUIVAR CURSO"}
                    <Image
                      src="/ARROW.svg"
                      alt="Logo da empresa"
                      className={styles.logo}
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>
              <div className={styles.content}>
                {course.lessons.map((lesson) => (
                  <div key={lesson.id} className={styles.person}>
                    <div className={styles.infoPerson}>
                      <h2>{lesson.title}</h2>
                    </div>
                    <div className={styles.btns}>
                      <Trash size={24} color="#01C790" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
