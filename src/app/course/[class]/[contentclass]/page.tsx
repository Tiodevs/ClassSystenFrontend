import { getCookiesServer } from "@/lib/cookieServer";
import { Header } from "../../../components/header";
import { Title } from "../../../components/title";
import { api } from "../../../services/api";
import Image from "next/image";

import styles from './styles.module.scss'
import Link from "next/link";
import { Button2 } from "@/app/components/button2";
import { Button3 } from "@/app/components/button3";
import { ClassContainer } from "../_components/class";

interface Course {
    id: string,
    title: string,
    content: any,
    url: string,
    createdAt: string,
    courseId: string,
    progress: any
}

interface Props {
    params: {
        contentclass: string,
        class: string 
    }
}

export default async function Class({ params }: Props) {

    const decodedId = decodeURIComponent(params.contentclass as string).trim()
    const decodedId2 = decodeURIComponent(params.class as string).trim()

    console.log(decodedId)
    console.log(params)
    
    const token = getCookiesServer()

    const responseLessonDatails = await api.get<Course[]>("/course/lesson", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const lessonDatails: Course[] = responseLessonDatails.data

    const filterLessonDatails = lessonDatails.filter(item => item.id === decodedId)

    // console.log("Lição atual:", filterLessonDatails)
    // console.log("Lição progress:", filterLessonDatails[0].progress)


    const resUserId = await api.get("/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }

    })

    const userid = resUserId.data

    return (
        <div>
            <Header />
            <main className={styles.main}>
                <div className={styles.esquerda}>
                    <div className={styles.content}>

                        <iframe className={styles.video} width="1730" height="666" src={`https://www.youtube.com/embed/${filterLessonDatails[0].url}`} title="Como Usar as Rotas Fixas e Dinâmicas no Nextjs 14" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>

                    </div>

                    <h1>{filterLessonDatails[0].title}</h1>
                    <p>{filterLessonDatails[0].content}</p>

                    <div className={styles.btn}>
                        <div>
                            <Button3
                                lesson_id={filterLessonDatails[0].id}
                                user_id={userid.id}
                                progress={filterLessonDatails[0].progress}
                            />
                        </div>
                    </div>
                </div>

                <ClassContainer
                    course_id={decodedId2}
                    user_id={userid.id}
                />

            </main>
        </div>
    )
}