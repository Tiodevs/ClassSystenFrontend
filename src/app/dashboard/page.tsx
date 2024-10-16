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

interface User {
    name: string;
    email: string;
    adm: boolean;
    photourl: string;
    Streak: Array<{
        currentStreak: number;
        maxStreak: number;
    }>
}

export default function Dashboard() {

    const [coursesProgress, setCoursesProgress] = useState([]);
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {

        async function getCurses() {
            const token = getCookiesClient()

            // Pega o user atual
            const getUserId = await api.get("/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(getUserId.data)

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
                        <div key={course.id} className={styles.card}>
                            <p>Quantidades de aulas assitiadas do<br />curso: <span>{course.courseName}</span></p>
                            <h2 key={course.courseName}>
                                {course.completedLessons}/{course.totalLessons}
                            </h2>
                        </div>
                    ))}

                    <div className={styles.card}>
                        {user && user.Streak?.length > 0 ? (
                            <div>
                                <p>Sua ofensiva atual</p>
                                <h2>{user.Streak[0].currentStreak}</h2>
                            </div>
                        ) : (
                            <p>Você ainda não iniciou uma ofensiva.</p>
                        )}
                    </div>
                    <div className={styles.card}>
                        {user && user.Streak?.length > 0 ? (
                            <div>
                                <p>Seu recorde de ofensiva</p>
                                <h2>{user.Streak[0].maxStreak}</h2>
                            </div>
                        ) : (
                            <p>Nenhum recorde de ofensiva encontrado.</p>
                        )}
                    </div>

                </div>


            </main>
        </div>
    )
}