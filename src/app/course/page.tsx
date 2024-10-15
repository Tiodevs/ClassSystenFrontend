import { getCookiesServer } from "@/lib/cookieServer";
import { Header } from "../components/header";
import { Title } from "../components/title";
import { api } from "../services/api";
import Image from "next/image";

import styles from './styles.module.scss'
import Link from "next/link";

interface Course {
    id: string;
    name: string;
    description: string;
    createdAt: string; // Pode usar Date se quiser trabalhar diretamente com objetos Date
    active: boolean;
}

export default async function Courses() {

    const token = getCookiesServer()

    const responseCourses = await api.get<Course[]>("/course", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const resCategories: Course[] = responseCourses.data

    // Filtra apenas os cursos que estão ativos
    const activeCourses = resCategories.filter((course: Course) => course.active)

    const getUserId = await api.get("/me",{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const getCursesByUser = await api.post("/users/courseid",{
        user_id: getUserId.data.id
    },{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const CursesByUser = getCursesByUser.data
    
    const allfiltersCourses = CursesByUser.map((item: any) => activeCourses.filter((a: any) => a.id === item.courseId))


    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Title
                    name01="Cursos"
                    name02="Todos os seus cursos"
                />
                <div className={styles.content}>
                    {allfiltersCourses.map((item: any) => (
                        item.map((itemm:any) => (
                            <Link href={`/course/${encodeURIComponent(itemm.id)}`}>
                            <div key={itemm.id}>
                                <h1>{itemm.name}</h1>
                                <Image
                                    src={"/Cursos.png"}
                                    alt="Logo do curso"
                                    className={styles.logo}
                                    width={200}
                                    height={200}
                                    priority
                                />
                                <p>{itemm.description}</p>
                            </div>
                        </Link>
                        ))
                    ))}
                </div>
            </main>
        </div>
    )
}