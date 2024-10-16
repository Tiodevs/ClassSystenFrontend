"use client"
import { Header } from "../components/header";
import { Title } from "../components/title";
import { api } from "../services/api";
import Image from "next/image";

import styles from './styles.module.scss'
import Link from "next/link";
import { redirect } from "next/navigation"
import { getCookiesClient } from "@/lib/cookieClient";
import { useEffect, useState } from "react";
import { Button2 } from "../components/button2";

interface User {
    name: string;
    email: string;
    adm: boolean;
    photourl: string;
    Streak: Array<{
        currentStreak: number;
        maxStreak: number;
    }>
}

export default function Game() {
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {

        async function getCurses() {
            const token = getCookiesClient()

            // Pega o user atual
            const getUserId = await api.get("/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(getUserId.data)

        }

        getCurses()



    }, []);


    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Title
                    name01="Aprenda com jogos é apender mais rápido."
                    name02="jogos de reforço"
                />


                <div className={styles.content}>

                    <Button2
                        name="FLASH CARD"
                        event={7}
                    />
                    <Button2
                        name="JOGO DA MEMORIA"
                        event={8}
                    />
                </div>


            </main>
        </div>
    )
}