"use client"

import { useEffect, useState } from "react";
import { Header } from "../../components/header";
import { Title } from "../../components/title";
import styles from './styles.module.scss'
import { EventsCardById } from "@/app/components/eventscardbyid";
import { getCookiesClient } from "@/lib/cookieClient";
import { api } from "@/app/services/api";
import { Button2 } from "@/app/components/button2";

import { Trash } from 'lucide-react'


interface Props {
    params: { userid: string }
}

interface User {
    id: string;
    name: string;
    email: string;
    photourl: string;
    active: boolean;
    courses: { courseId: string; course: { name: string } }[];
}

interface Course {
    id: string;
    name: string;
    active: boolean;
    lessons: { id: string; title: string }[];
    course: any
}

export default function EditUser({ params }: Props) {
    const decodedId = decodeURIComponent(params.userid as string).trim()

    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getCookiesClient();

                const usersResponse = await api.get("users", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const coursesResponse = await api.post("/users/courseid",{
                    user_id: decodedId
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const resUsers = usersResponse.data

                const filterUsers = resUsers.filter((item: User) => item.id === decodedId)

                const resCourses = coursesResponse.data

                

                setUsers(filterUsers);
                setCourses(coursesResponse.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, []);

    if(courses.length > 0){
        console.log(courses[0].course.name)
    }

    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Title
                    name01="Painel de configuração do aluno"
                    name02={users.length > 0 ? users[0].name : "Carregando..."}
                />

                <div className={styles.btnheader}>
                    <Button2
                        name="CRIAR EVENTO"
                        event={5}
                        userId={decodedId}
                    />
                    <Button2
                        name="ATRIBUIR CURSO"
                        event={1}
                        userId={decodedId}
                    />
                </div>

                <EventsCardById userId={decodedId} />

                <div className={styles.contentCourses}>
                    {courses.map((item:any) => (
                        <div key={item.id} className={styles.course}>
                            <p>{item.course.name}</p>
                            <Trash size={27} color="#FFFF" />
                        </div>
                    ))}
                </div>

                
            </main>
        </div>
    )
}