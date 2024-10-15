"use client"

import styles from '../../../page.module.scss'
import { redirect } from "next/navigation"
import { Button2 } from "@/app/components/button2"
import { api } from "@/app/services/api"
import { ChangeEvent, useState } from "react"

import { InstagramIcon, Smartphone, Linkedin } from 'lucide-react'
import { getCookiesClient } from '@/lib/cookieClient'

interface Props {
    params: { id: string }
}

export default function CrateCourse({ params }: Props) {

    const decodedId = decodeURIComponent(params.id as string).trim()

    const [loading, setLoading] = useState<boolean>(false);

    async function handleRegister(formData: FormData) {

        setLoading(!loading)
        const title = formData.get("title")
        const namecourse = formData.get("namecourse")
        const content = formData.get("content")
        const url = formData.get("url")

        if (title === "" || namecourse === "" || content === "" || url === "") {
            console.log("Preencha todos os campos")
            return
        }

        try {

            const token = getCookiesClient()

            const course = await api.get("/course", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const resCourse = course.data

            const filterCourse = resCourse.filter((item: any) => item.name === namecourse)

            await api.post("/course/lesson", {
                title: title,
                course_id: decodedId,
                content: content,
                url: url
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            redirect("/adm")
        } catch (err) {
            console.log("error: ", err)
        }

        redirect("/adm")
    }

    return (
        <>
            <div className={styles.containerCenter}>

                <section className={styles.login}>
                    <div className={styles.esquerda}>
                        <div>
                            <h1>Criar aula</h1>
                            <p>Lembre de criar nomes <span>chamativos</span></p>
                            <div>
                                <InstagramIcon size={25} color="#01DEB2" />
                                <Smartphone size={25} color="#01DEB2" />
                                <Linkedin size={25} color="#01DEB2" />
                            </div>
                        </div>
                        <p>© 2024 Felipe Santos</p>
                    </div>
                    <form action={handleRegister}>

                        <div>
                            <p>Titulo</p>
                            <input
                                type="text"
                                required
                                name="title"
                                className={styles.input}
                            />
                        </div>

                        <div>
                            <p>Descrição</p>
                            <input
                                type="text"
                                required
                                name="content"
                                className={styles.input}
                            />
                        </div>

                        <div>
                            <p>URL do vídeo</p>

                            <input
                                type="text"
                                required
                                name="url"
                                className={styles.input}
                            />
                        </div>

                        <button type="submit">{!loading ? "CADASTRAR" : "CARREGANDO..."}</button>
                    </form>
                </section>
            </div>
        </>
    )
}