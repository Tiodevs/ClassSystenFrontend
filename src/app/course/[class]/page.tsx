import { getCookiesServer } from "@/lib/cookieServer";
import { Header } from "../../components/header";
import { Title } from "../../components/title";
import { api } from "../../services/api";
import styles from './styles.module.scss'
import { ClassContainer } from "./_components/class";


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

    const responseCourses = await api.get<Course[]>("/course", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const resCurses: Course[] = responseCourses.data
    const filterCourse = resCurses.filter(item => item.id === decodedId)

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
                <Title
                    name01="Aulas"
                    name02= {filterCourse[0].name}
                />

                <ClassContainer
                    course_id={decodedId}
                    user_id={userid.id}
                />
            </main>
        </div>
    )
}