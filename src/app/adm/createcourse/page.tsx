"use client"

import Image from "next/image"
import styles from '../../page.module.scss'
import { api } from "../../services/api"
import { redirect } from "next/navigation"
import { Button2 } from "@/app/components/button2"
// import { getCookiesServer } from "@/lib/cookieServer"
import { getCookiesClient } from "@/lib/cookieClient"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import { InstagramIcon, Smartphone, Linkedin } from 'lucide-react'

export default function CrateCourse() {

    const [image, setImage] = useState<File>()
    const [previewImage, setPreviewImage] = useState("")
    const [loading, setLoading] = useState<boolean>(false);

    async function handleRegister(formData: FormData) {

        setLoading(!loading)
        const name = formData.get("name")
        const description = formData.get("description")

        if (name === "" || description === "") {
            console.log("Preencha todos os campos")
            return
        }

        const data = new FormData()

        data.append("name", name as string)
        data.append("description", description as string)
        data.append("banner", image as any)

        console.log(data)

        try {

            const token = getCookiesClient()

            await api.post("/course", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            redirect("/adm")
        } catch (err) {
            console.log("error: ", err)
            setLoading(!loading)
        }

        redirect("/adm")
    }

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type !== "image/jpeg" && image.type !== "image/png") {
                toast.warning("Formato não permetido!!!")
                return;
            }
            setImage(image);
            setPreviewImage(URL.createObjectURL(image))
        }
    }

    return (
        <>
            <div className={styles.containerCenter}>

                <section className={styles.login}>
                <div className={styles.esquerda}>
                        <div>
                            <h1>Criar curso</h1>
                            <p>Lembre de criar nomes <span>chamativos</span></p>
                            <p>Qualquer duvida entre em <span>contato</span></p>
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
                            <p>Nome</p>
                        <input
                            type="text"
                            required
                            name="name"
                            className={styles.input}
                        />
                        </div>

                        <div>
                            <p>Descrição</p>
                        <input
                            type="text"
                            required
                            name="description"
                            className={styles.input}
                        />
                        </div>

                        <label className={styles.labelImage}>
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                name="photourl"
                                onChange={handleFile}
                                required
                            />
                        </label>

                        <button type="submit">{!loading ? "CADASTRAR" : "CARREGANDO..."}</button>
                    </form>

                    {/* <Link href="/" className={styles.text}>
                        Já possui uma conta? Faça login.
                    </Link> */}
                </section>
            </div>
        </>
    )
}