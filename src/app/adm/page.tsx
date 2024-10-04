import { getCookiesServer } from "@/lib/cookieServer";
import { Header } from "../components/header";
import { Title } from "../components/title";
import Image from "next/image";

import { LockKeyhole, Check } from 'lucide-react'


import styles from './styles.module.scss';
import { api } from "../services/api";
import { Button } from "../components/button";

export default async function Adm() {

    const token = getCookiesServer();

    const users = await api.get('users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const resUsers = users.data;

    return (
        <div>
            <Header />
            <main className={styles.main}>

                <Title
                    name01="Administrador"
                    name02="Painel de contas"
                />

                <div className={styles.content}>
                    {resUsers.map((user: any) => (
                        <div key={user.id}>
                            <div key={user.id} className={styles.person}>
                                <div className={styles.infoPerson}>
                                    <Image
                                        src={"/profile.png"}
                                        alt="Logo do curso"
                                        className={styles.logo}
                                        width={78}
                                        height={78}
                                        priority
                                    />
                                    <div>
                                        <h1>{user.name}</h1>
                                        <div className={styles.infoCursePerson}>
                                            <p>{user.email}</p>
                                            <p> • </p>
                                            {user.courses?.map((course: any) => (
                                                course.courseId !== "" ? <p key={course.courseId}>{course.course.name},</p> : <p>Sem cursos</p>

                                            ))}
                                            <p> • </p>
                                            {user.active ? <p>Ativo: true</p> : <p>Ativo: falso</p>}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                name={user.active}
                                user_id={user.id}
                                />
                            </div>
                            <div className={styles.line}></div>
                        </div>
                    ))}
                </div>
            </main >
        </div >
    );
}
