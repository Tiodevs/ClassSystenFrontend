"user client"

import { Header } from "../../components/header";
import { Title } from "../../components/title";
import styles from './styles.module.scss'
import { EventsCardById } from "@/app/components/eventscardbyid";

interface Props {
    params: { userid: string }
}

export default function EditUser({ params }: Props) {
    const decodedId = decodeURIComponent(params.userid as string).trim()


    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Title
                    name01="A"
                    name02="Agenda do curso"
                />
                <EventsCardById userId={decodedId}/>
            </main>
        </div>
    )
}