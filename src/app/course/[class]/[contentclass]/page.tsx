import { getCookiesServer } from "@/lib/cookieServer";
import { Header } from "../../../components/header";
import { Title } from "../../../components/title";
import { api } from "../../../services/api";
import Image from "next/image";

import styles from './styles.module.scss'
import Link from "next/link";

interface Course {
    id: string,
    title: string,
    content: any,
    url: string,
    createdAt: string,
    courseId: string,
}

interface Props {
    params: { contentclass: string }
}

export default async function Class({ params }: Props) {

    const decodedId = decodeURIComponent(params.contentclass as string).trim()

    const token = getCookiesServer()

    const responseLessonDatails = await api.get<Course[]>("/course/lesson", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const lessonDatails: Course[] = responseLessonDatails.data

    const filterLessonDatails = lessonDatails.filter(item => item.id === decodedId)

    console.log("Item selecionado:", filterLessonDatails)

    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Title
                    name01="Aula"
                    name02={filterLessonDatails[0].title}
                />
                <div className={styles.content}>

                    <iframe width="1730" height="666" src={`https://www.youtube.com/embed/${filterLessonDatails[0].url}`} title="Como Usar as Rotas Fixas e Dinâmicas no Nextjs 14" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                    
                </div>
                    <p>{filterLessonDatails[0].content}</p>

            </main>
        </div>
    )
}