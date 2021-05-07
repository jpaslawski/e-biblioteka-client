import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NotificationModal from '../Modals/NotificationModal';
import './Home.css';

const Home = () => {

    const [ notifications, setNotifications ] = useState([]);
    const [ isOpen, setIsOpen ] = useState(false);

    const handleModal = () => setIsOpen(!isOpen);

    const showNotifications = sessionStorage.getItem("showNotifications") ? false : true;

    useEffect(() => {
        if(sessionStorage.getItem("token")) {
            axios.get("/api/books/notifications")
                .then(response => {
                    if(response.data) {
                        setNotifications(response.data);
                        setIsOpen(true);
                    }
                });
        }
    }, []);

    return (
        <div className="content">
            { isOpen && showNotifications && <NotificationModal 
                            notifications={ notifications }
                            handleModal={ handleModal } /> }
            <h2>Internetowa wypożyczalnia książek</h2>
            <div className="description">
                <p>Aplikacja umożliwia reserwację, wypożyczenie oraz zwrot książek.
                Ilość egzemplarzy danej książki jest ograniczona.
                Aby ułatwić proces wyszukiwania książki utworzono filtry określające gatunek
                książki oraz przedmioty, których może ona dotyczyć.
                    </p>
                <p>Proces wypożyczania książki odbywa się na następujących zasadach:</p>
                <ul>
                    <li>
                        Aby zarezerwować książkę niezbędne jest posiadanie konta na tej stronie. Można je założyć naciskając <b>Załóż konto</b>.
                        </li>
                    <li>
                        Użytkownik znajduje interesującą go książkę, jeśli jest ona dostępna, naciska <b>Zarezerwuj</b>.
                        </li>
                    <li>
                        Użytkownik ma 2 dni na odbiór<b>*</b> książki. Jeśli książka nie zostanie odebrana, rezerwacja przepada.
                        </li>
                    <li>
                        Jeśli wszystkie egzemplarze danej książki są wypożyczone, widoczna będzie przewidywana data zwrotu książki przez innego użytkownika.
                        </li>
                    <li>
                        Po odbiorze książki, użytkownik powinien ją zwrócić<b>*</b> do 30 dni od dnia odbioru. Tydzień przed planowaną datą zwrotu użytkownik 
                        będzie dostawał powiadomienie przy logowaniu o pozostałym czasie wypożyczenia. 
                        </li>
                    <li>
                        <b>*</b> Odbiór oraz zwrot książki odbywa się na stronie internetowej, w sekcji <b>Wypożyczenia</b>.
                    </li>
                </ul>
            </div>
        </div>)
}

export default Home;