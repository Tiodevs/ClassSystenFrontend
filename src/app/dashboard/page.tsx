"use client"
import { Header } from "../components/header";
import { Title } from "../components/title";
import { api } from "../services/api";
import Image from "next/image";

import styles from './styles.module.scss'
import Link from "next/link";
import { redirect } from "next/navigation"
import { getCookiesClient } from "@/lib/cookieClient";
import { useEffect, useState } from "react";

interface Course {
    id: string;
    name: string;
    description: string;
    createdAt: string; // Pode usar Date se quiser trabalhar diretamente com objetos Date
    active: boolean;
    lessons: any
}

export default function Dashboard() {

    const [coursesProgress, setCoursesProgress] = useState([]);
    const [loading, setloading] = useState(true)
    const [loading2, setloading2] = useState(false)

    useEffect(() => {

        async function getCurses() {
            const token = getCookiesClient()

            // Pega o user atual
            const getUserId = await api.get("/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Pega apenas os cursos do usuario
            const getCursesByUser = await api.post("/users/courseid", {
                user_id: getUserId.data.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const CursesByUser = getCursesByUser.data

            console.log(CursesByUser)

            // Conta a quantidade de lições e lições completadas de cada curso
            const coursesWithProgress = CursesByUser.map((course: any) => {
                const totalLessons = course.course.lessons.length;
                const completedLessons = course.course.lessons.filter((lesson: any) =>
                    lesson.progress.some((p: any) => p.completed === true && p.userId === getUserId.data.id)
                ).length;

                return {
                    courseName: course.course.name,
                    totalLessons,
                    completedLessons,
                };
            });

            console.log("Progresso dos cursos:", coursesWithProgress);

            setCoursesProgress(coursesWithProgress);
            setloading(false);

        }

        getCurses()



    }, []);


    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Title
                    name01="Veja aqui o seu progresso e avisos do curso"
                    name02="dashboard"
                />


                <div className={styles.content}>

                    {coursesProgress.map((course: any) => (
                        <div className={styles.card}>
                            <p>Quantidades de aulas assitiadas do<br/>curso: <span>{course.courseName}</span></p>
                            <h2 key={course.courseName}>
                                {course.completedLessons}/{course.totalLessons}
                            </h2>
                        </div>
                    ))}
                </div>


            </main>
        </div>
    )
}