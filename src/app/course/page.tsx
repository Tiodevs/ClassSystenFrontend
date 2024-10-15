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

export default function Courses() {

    const [courses, setCourses] = useState([])
    const [aulaid, setAulaid] = useState("")
    const [loading, setloading] = useState(true)
    const [loading2, setloading2] = useState(false)

    useEffect(() => {

        async function getCurses() {
            const token = getCookiesClient()

            const responseCourses = await api.get<Course[]>("/course", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(responseCourses.data.length > 0){

                setAulaid(responseCourses.data[0].lessons[0].id) 
            }


            const resCategories: Course[] = responseCourses.data

            // Filtra apenas os cursos que estão ativos
            const activeCourses = resCategories.filter((course: Course) => course.active)

            const getUserId = await api.get("/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const userActive = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const resUserActive = userActive.data

            const filterUserActive = resUserActive.filter((item: any) => item.active === true)

            const validetionUser = filterUserActive.filter((item: any) => item.id === getUserId.data.id)

            const getCursesByUser = await api.post("/users/courseid", {
                user_id: getUserId.data.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const CursesByUser = getCursesByUser.data

            let allfiltersCourses = CursesByUser.map((item: any) => activeCourses.filter((a: any) => a.id === item.courseId))

            if (validetionUser.length === 0) {
                redirect("/")
            }

            setCourses(allfiltersCourses)

        }

        getCurses()

        setloading(false)

        console.log("Resposta do curso: ", aulaid)

        
    }, []);


    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Title
                    name01="Veja todos os cursos que você esta matriculado aqui."
                    name02="Todos os seus cursos"
                />
                <div className={styles.content}>
                    {courses.length > 0 ? ( courses.map((item: any) => (
                        item.map((itemm: any) => (

                            <div key={itemm.id}>
                                <Image
                                    src={itemm.banner}
                                    alt="Logo do curso"
                                    className={styles.logo}
                                    width={370}
                                    height={200}
                                    priority
                                />
                                <Link href={`/course/${encodeURIComponent(itemm.id)}/${aulaid}`} className={styles.btn} onClick={()=> setloading2(true)}>
                                    {loading2 ? "CARREGANDO..." : "ENTRAR NO CURSO"}
                                </Link>
                            </div>
                        ))
                    ))) : (
                        loading ? <p className={styles.loading}>Carregando...</p> : <p className={styles.loading}>Nenhum curso encontrado.</p>
                    )}
                </div>
            </main>
        </div>
    )
}