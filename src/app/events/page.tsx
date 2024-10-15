import { Header } from "../components/header";
import { Title } from "../components/title";
import styles from './styles.module.scss'
import { EventsCard } from "../components/eventscard";


export default async function Courses() {

    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Title
                    name01="Todos os seus eventos aqui"
                    name02="Agenda do curso"
                />
                <EventsCard/>
            </main>
        </div>
    )
}