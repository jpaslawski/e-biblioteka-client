import { RESERVATION_STATUS } from '../../Constants';

const UserTable = ({displayedReservations, changeBookStatus }) => {

    return (
        <table>
            <thead>
                <tr>
                    <th>Książka</th>
                    <th>Data rezerwacji</th>
                    <th>Status</th>
                    <th>Działania</th>
                </tr>
            </thead>
            <tbody>
                {displayedReservations && displayedReservations.map(({ id, book, date, status }) => (
                    <tr key={id}>
                        <td>
                            <a href={"/books/" + book.id}>{book.name}</a>
                        </td>
                        <td>{new Date(date).toLocaleString()}</td>
                        <td>
                            {status === RESERVATION_STATUS.reserved && "Gotowa do obioru"}
                            {status === RESERVATION_STATUS.collected && "Wypożyczona"}
                            {status === RESERVATION_STATUS.returned && "Zwrócona"}
                        </td>
                        <td>
                            {status === RESERVATION_STATUS.reserved &&
                                <button onClick={() => changeBookStatus(id, RESERVATION_STATUS.collected)}>ODBIERZ</button>}
                            {status === RESERVATION_STATUS.collected &&
                                <button onClick={() => changeBookStatus(id, RESERVATION_STATUS.returned)}>ZWRÓĆ</button>}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default UserTable;