"use client"

import { InstagramIcon, Smartphone, Linkedin } from 'lucide-react'
import styles from '../../../page.module.scss'
import { redirect } from "next/navigation"
import { getCookiesClient } from "@/lib/cookieClient"
import { api } from "@/app/services/api"
import { ChangeEvent, useState } from "react"


interface Props {
    params: { id: string }
}

export default function CrateEvent({ params }: Props) {

    const decodedId = decodeURIComponent(params.id as string).trim()


    const [loading, setLoading] = useState<boolean>(false);


    async function handleRegister(formData: FormData) {

        setLoading(!loading)

        const title = formData.get("title") as string | null;
        const date = formData.get("date") as string | null;
        const place = formData.get("place") as string | null;
        const duration = formData.get("duration") as string | null;


        // Validação correta para campos vazios ou nulos
        if (!title || !date || !place || !duration) {
            console.log("Preencha todos os campos");
            return;
        }


        try {
            const token = getCookiesClient()

            await api.post("/course/events", {
                title,
                date,
                place,
                duration,
                userId: decodedId, // Adiciona o userId ao evento
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            redirect(`/adm/${decodedId}`)
        } catch (err) {
            console.log("error: ", err)
        }
        redirect(`/adm/${decodedId}`)
    }

    return (
        <>
            <div className={styles.containerCenter}>


                <section className={styles.login}>
                    <div className={styles.esquerda}>
                        <div>
                            <h1>Criar evento</h1>
                            <p>Lembre de criar nomes <span>claros</span></p>
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
                            <p>Data</p>
                            <input
                                type="text"
                                required
                                name="date"
                                className={styles.input}
                            />
                        </div>

                        <div>
                            <p>Lugar</p>
                            <input
                                type="text"
                                required
                                name="place"
                                className={styles.input}
                            />
                        </div>

                        <div>
                            <p>Duração</p>
                            <input
                                type="text"
                                required
                                name="duration"
                                className={styles.input}
                            />
                        </div>
                        <button type="submit">{!loading ? "CRIAR" : "CARREGANDO..."}</button>
                    </form>

                </section>
            </div>
        </>
    )
}