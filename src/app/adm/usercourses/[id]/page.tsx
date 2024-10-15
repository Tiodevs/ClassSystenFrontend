"use client"

import styles from '../../../page.module.scss'
import { useRouter } from "next/navigation"; // Importar useRouter
import { api } from "@/app/services/api"
import { getCookiesClient } from "@/lib/cookieClient"

import { InstagramIcon, Smartphone, Linkedin } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from "react"

interface Props {
    params: { id: string }
}

export default function UserCourse({ params }: Props) {

    const decodedId = decodeURIComponent(params.id as string).trim()

    const router = useRouter(); // Inicializar useRouter

    const [loading, setLoading] = useState<boolean>(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [select, setSelect] = useState("teste");

    useEffect(() => {
        const fetchCourses = async () => {
            const token = getCookiesClient(); // Lembre-se de obter o token antes de fazer a requisição

            const response = await api.get("/course", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const resCourses = response.data;
            setCourses(resCourses);
        };

        fetchCourses();
    }, []);

    async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        setLoading(true);

        if (!select) {
            console.log("Por favor, selecione um curso");
            setLoading(false);
            return;
        }

        const token = getCookiesClient();

        try {
            await api.post("/users/course", {
                user_id: decodedId,
                course_id: select
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            router.push(`/adm/${decodedId}`);
        } catch (err) {
            console.log("error: ", err);
        }

        router.push(`/adm/${decodedId}`);
    }

    return (
        <>
            <div className={styles.containerCenter}>

                <section className={styles.login}>
                    <div className={styles.esquerda}>
                        <div>
                            <h1>Atribuir curso</h1>
                            <p>Lembre de vericar sempre o <span>curso</span></p>
                            <div>
                                <InstagramIcon size={25} color="#01DEB2" />
                                <Smartphone size={25} color="#01DEB2" />
                                <Linkedin size={25} color="#01DEB2" />
                            </div>
                        </div>
                        <p>© 2024 Felipe Santos</p>
                    </div>
                    <form onSubmit={handleRegister}>
                        <select
                            required
                            name="courseSelect"
                            value={select}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelect(e.target.value)}
                            className={styles.input}
                        >
                            <option value="" disabled>Selecione um curso</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>

                        <button type="submit">{!loading ? "CADASTRAR" : "CARREGANDO..."}</button>

                    </form>
                </section>
            </div>
        </>
    )
}