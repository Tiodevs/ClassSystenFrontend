"use client"

import Image from "next/image"
import styles from '../../page.module.scss'
import { api } from "../../services/api"
import { redirect } from "next/navigation"
import { Button2 } from "@/app/components/button2"
import { getCookiesClient } from "@/lib/cookieClient"

export default function CrateEvent() {

    async function handleRegister(formData: FormData) {

        const title = formData.get("title") as string | null;
        const date = formData.get("date") as string | null;
        const place = formData.get("place") as string | null;
        const duration = formData.get("duration") as string | null;
        const email = formData.get("email") as string | null;

        // Validação correta para campos vazios ou nulos
        if (!title || !date || !place || !duration || !email) {
            console.log("Preencha todos os campos");
            return;
        }


        try {
            const token = getCookiesClient()

            const user = await api.get("/me",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const resUser = user.data

            console.log(resUser)

            await api.post("/course/events", {
                title,
                date,
                place,
                duration,
                userId: resUser.id, // Adiciona o userId ao evento
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            redirect("/adm")
        } catch (err) {
            console.log("error: ", err)
        }
        redirect("/adm")
    }

    return (
        <>
            <div className={styles.containerCenter}>
                <Image
                    src={"/logo.svg"}
                    alt="Logo da empresa"
                    className={styles.logo}
                    width={700}
                    height={80}
                />

                <section className={styles.login}>
                    <h1 className={styles.titleLogin}>Criar evento</h1>
                    <form action={handleRegister}>
                        <input
                            type="text"
                            required
                            name="title"
                            placeholder="Titulo"
                            className={styles.input}
                        />

                        <input
                            type="text"
                            required
                            name="date"
                            placeholder="Data"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="place"
                            placeholder="Lugar"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="duration"
                            placeholder="Duração"
                            className={styles.input}
                        />
                        <input
                            type="email"
                            required
                            name="email"
                            placeholder="Email do aluno"
                            className={styles.input}
                        />
                        <Button2
                            name="Cadastrar"
                            event={0}
                        />
                    </form>

                </section>
            </div>
        </>
    )
}