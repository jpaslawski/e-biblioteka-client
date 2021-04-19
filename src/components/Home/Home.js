import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="content">
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
                        Użytkownik ma 2 dni na odbiór<b>*</b> książki.
                        </li>
                    <li>
                        Jeśli wszystkie egzemplarze danej książki są wypożyczone, widoczna będzie przewidywana data zwrotu książki przez innego użytkownika.
                        </li>
                    <li>
                        Po odbiorze książki, użytkownik powinien ją zwrócić<b>*</b> do 30 dni od dnia odbioru.
                        </li>
                    <li>
                        <b>*</b> Odbiór oraz zwrot książki odbywa się na stronie internetowej, w sekcji <b>Wypożyczenia</b>.
                        </li>
                </ul>
            </div>
        </div>)
}

export default Home;