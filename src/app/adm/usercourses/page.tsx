import Image from "next/image"
import styles from '../../page.module.scss'
import { api } from "../../services/api"
import { redirect } from "next/navigation"
import { Button2 } from "@/app/components/button2"
import { getCookiesServer } from "@/lib/cookieServer"

export default function UserCourse() {

    async function handleRegister(formData: FormData) {
        "use server"

        const emailUser = formData.get("emailUser")
        const nameCourse = formData.get("nameCourse")

        if (emailUser === "" || nameCourse === "" ) {
            console.log("Preencha todos os campos")
            return
        }

        const token = getCookiesServer()


        const users = await api.get("/users",{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        const reUsers = users.data

        const filterUser = reUsers.filter((item:any) => item.email === emailUser)


        const courses = await api.get("/course",{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        const resCourses = courses.data

        const filterCourses = resCourses.filter((item:any) => item.name === nameCourse)



        try {

            await api.post("/users/course", {
                user_id: filterUser[0].id,
                course_id: filterCourses[0].id
            },{
                headers:{
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
                <Image
                    src={"/logo.svg"}
                    alt="Logo da empresa"
                    className={styles.logo}
                    width={700}
                    height={80}
                />

                <section className={styles.login}>
                <h1 className={styles.titleLogin}>Criar curso</h1>
                    <form action={handleRegister}>
                        <input
                            type="text"
                            required
                            name="emailUser"
                            placeholder="Email do aluno"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="nameCourse"
                            placeholder="Nome do curso"
                            className={styles.input}
                        />

                        <Button2
                        name="Cadastrar"
                        event={0}
                        />
                    </form>

                    {/* <Link href="/" className={styles.text}>
                        Já possui uma conta? Faça login.
                    </Link> */}
                </section>
            </div>
        </>
    )
}