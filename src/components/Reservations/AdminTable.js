import { RESERVATION_STATUS } from '../../Constants';

const AdminTable = ({ displayedReservations }) => {

    return(
        <table>
            <thead>
                <tr>
                    <th>Użytkownik</th>
                    <th>Książka</th>
                    <th>Data rezerwacji</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {displayedReservations && displayedReservations.map(({ id, book, date, status, user }) => (
                    <tr key={id}>
                        <td key={user.id}>
                            <a href={"/users/" + user.id}>{ user.firstName } { user.lastName }</a>
                        </td>
                        <td>
                            <a href={"/books/" + book.id}>{book.name}</a>
                        </td>
                        <td>{new Date(date).toLocaleString()}</td>
                        <td>
                            {status === RESERVATION_STATUS.reserved && "Gotowa do obioru"}
                            {status === RESERVATION_STATUS.collected && "Wypożyczona"}
                            {status === RESERVATION_STATUS.returned && "Zwrócona"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default AdminTable;