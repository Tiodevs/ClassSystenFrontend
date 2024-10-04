import { getCookiesServer } from "@/lib/cookieServer";
import { Header } from "../../components/header";
import { Title } from "../../components/title";
import { api } from "../../services/api";
import Image from "next/image";

import styles from './styles.module.scss'
import Link from "next/link";

interface Courses {
    id: string,
    title: string,
    content: any,
    createdAt: string,
    courseId: string,
    progress: any
}

interface Course {
    id: string;
    name: string;
    description: string;
    createdAt: string; // Pode usar Date se quiser trabalhar diretamente com objetos Date
    active: boolean;
}

interface Props {
    params: { class: string }
}

export default async function Class({ params }: Props) {

    const decodedId = decodeURIComponent(params.class as string).trim()

    const token = getCookiesServer()

    const responseClass = await api.post<Courses[]>("/course/lessonbyid", {
        course_id: decodedId
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const classes : Courses[] = responseClass.data

    const responseCourses = await api.get<Course[]>("/course", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const resCurses: Course[] = responseCourses.data

    const filterCourse = resCurses.filter(item => item.id === decodedId)

    console.log(classes)

    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Title
                    name01="Aulas"
                    name02= {filterCourse[0].name}
                />
                <div className={styles.content}>
                    {classes.map((item: any) => (
                        <Link href={`/course/${decodedId}/${item.id}`}>
                            <div className={styles.div}>
                                <h1>{item.title}</h1>
                                
                            </div>

                            <div className={styles.line}></div>

                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}