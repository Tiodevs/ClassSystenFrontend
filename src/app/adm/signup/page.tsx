"use client"

import Image from "next/image"
import styles from '../../page.module.scss'
// import LogoImg from '/Logo.svg'
import { api } from "../../services/api"
import { redirect } from "next/navigation"
import { Button2 } from "@/app/components/button2"
import { ChangeEvent, useState } from "react"
import { InstagramIcon, Smartphone, Linkedin } from 'lucide-react'
import { toast } from "sonner"

export default function Signup() {

    const [image, setImage] = useState<File>()
    const [previewImage, setPreviewImage] = useState("")
    const [loading, setLoading] = useState<boolean>(false);

    async function handleRegister(formData: FormData) {

        setLoading(!loading)
        const name = formData.get("name")
        const email = formData.get("email")
        const password = formData.get("password")

        if (name === "" || email === "" || password === "") {
            console.log("Preencha todos os campos")
            return
        }

        const data = new FormData()

        data.append("name", name as string)
        data.append("email", email as string)
        data.append("password", password as string)
        data.append("photourl", image as any)

        console.log(data)

        try {
            await api.post("/users", data)
        } catch (err) {
            console.log("error: ", err)
            return
        }
        setLoading(!loading)
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
                            <h1>Criar user</h1>
                            <p>As senhas estão todas <span>criptografadas no DB</span></p>
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
                            <p>Nome do aluno</p>
                            <input
                                type="text"
                                required
                                name="name"
                                className={styles.input}
                            />
                        </div>

                        <div>
                            <p>Email</p>
                            <input
                                type="email"
                                required
                                name="email"
                                className={styles.input}
                            />
                        </div>

                        <div>
                            <p>Senha</p>
                            <input
                                type="password"
                                required
                                name="password"
                                className={styles.input}
                            />
                        </div>
                        <div>
                            <label className={styles.labelImage}>
                            <p>Escolha uma foto: <br/></p>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    name="photourl"
                                    onChange={handleFile}
                                    required
                                />
                            </label>
                        </div>

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