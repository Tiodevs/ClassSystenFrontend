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

    const [courses, setCourses] = useState([])
    const [loading, setloading] = useState(true)
    const [loading2, setloading2] = useState(false)

    useEffect(() => {

        async function getCurses() {
            const token = getCookiesClient()

            // Pega todos os cursos
            const responseCourses = await api.get<Course[]>("/course", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const resCategories: Course[] = responseCourses.data

            // Filtra apenas os cursos ativos
            const activeCourses = resCategories.filter(
                (course: Course) => course.active
            );

            // Pega o user atual
            const getUserId = await api.get("/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userId = getUserId.data.id;

            // Pega todos os users do sistema
            const userActive = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const resUserActive = userActive.data

            // Deixa apenas os users ativos
            const filterUserActive = resUserActive.filter((item: any) => item.active === true)


            // Verifica se ele está ativo se tiver salva ele
            const user  = filterUserActive.filter((item: any) => item.id === getUserId.data.id)
            console.log("Usuario atual autenticado: ", user)

            if (user.length === 0) {
                redirect("/")
            }

            // Pega apenas os cursos do usuario
            const getCursesByUser = await api.post("/users/courseid", {
                user_id: getUserId.data.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const CursesByUser = getCursesByUser.data

            console.log("Cursos do user atual: ", CursesByUser)

            let allfiltersCourses = CursesByUser.map((item: any) =>
                activeCourses.filter((a: any) => a.id === item.courseId)
            );

            console.log("Teste:", allfiltersCourses)

            // Extrai nome e quantidade de aulas de cada curso
            const courseSummaries = allfiltersCourses.flatMap((courseArray: any) =>
                courseArray.map((course: any) => ({
                    name: course.name,
                    lessonCount: course.lessons.length
                }))
            );

            console.log("aopa:", courseSummaries)

            setCourses(allfiltersCourses)

        }

        getCurses()

        setloading(false)


    }, []);


    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Title
                    name01="Veja aqui o seu progresso e avisos do curso"
                    name02="dashboard"
                />

            </main>
        </div>
    )
}