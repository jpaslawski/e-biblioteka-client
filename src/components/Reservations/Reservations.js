import React from 'react';
import './Reservations.css';
import axios from 'axios';
import { redirectToSignIn } from '../../HelperMethods';

class Reservations extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            bookId: this.props.match.params.bookId,
            reservations: [],
            isModalOpen: false,
            message: undefined
        }

        this.setModalStatus = this.setModalStatus.bind(this);
        this.collectBook = this.collectBook.bind(this);
        this.returnBook = this.returnBook.bind(this);
    }

    setModalStatus(status) {
        this.setState({
            isModalOpen: status
        })
    }

    collectBook(reservationId) {
        axios.put("/api/reservations/" + reservationId + "?newStatus=COLLECTED")
            .then(response => {
                let updatedReservation = response.data;
                let index = this.state.reservations.findIndex(x => x.id === updatedReservation.id);
                let updatedReservations = this.state.reservations;
                updatedReservations[index] = updatedReservation;

                this.setState({
                    reservations: updatedReservations,
                    isModalOpen: true,
                    message: "Pomyślnie odebrano książkę! Pamiętaj, aby zwrócić ją do 30 dni."
                })
            })
            .catch(error => {
                if (!error.response) {
                    this.setState({
                        isModalOpen: true,
                        message: "Network Error!"
                    });
                } else {
                    this.setState({
                        isModalOpen: true,
                        message: error.response.data.message
                    });
                }
            });
    }


    returnBook(reservationId) {
        axios.put("/api/reservations/" + reservationId + "?newStatus=RETURNED")
            .then(response => {
                let updatedReservation = response.data;
                let index = this.state.reservations.findIndex(x => x.id === updatedReservation.id);
                let updatedReservations = this.state.reservations;
                updatedReservations[index] = updatedReservation;

                this.setState({
                    reservations: updatedReservations,
                    isModalOpen: true,
                    message: "Dziękujemy za zwrot książki."
                })
            })
            .catch(error => {
                if (!error.response) {
                    this.setState({
                        isModalOpen: true,
                        message: "Network Error!"
                    });
                } else {
                    this.setState({
                        isModalOpen: true,
                        message: error.response.data.message
                    });
                }
            });
    }

    componentDidMount() {
        axios.get("/api/reservations")
            .then(response => {
                this.setState({
                    reservations: response.data
                })
            })
            .catch(error => {
                if (!error.response) {
                    this.setState({
                        isModalOpen: true,
                        message: "Network Error!"
                    });
                } else {
                    this.setState({
                        isModalOpen: true,
                        message: error.response.data.message
                    });
                }
            });

        if(sessionStorage.getItem("token") === null) {
            redirectToSignIn();
        }
    }

    render() {

        let { reservations, isModalOpen, message } = this.state;

        return (
            <div className="content">
                {isModalOpen && <div className="modal">
                    <div className="modal-container">
                        <i className=" fas fa-times" onClick={() => this.setModalStatus(false)}></i>
                        <div>{message}</div>
                    </div>
                </div>}
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
                    {reservations && reservations.map(({ id, book, date, status }) => (
                        <tr key={id}>
                            <td>
                                <a href={"/books/" + book.id}>{book.name}</a>
                            </td>
                            <td>{new Date(date).toLocaleString()}</td>
                            <td>
                                {status === "RESERVED" && "Gotowa do obioru"}
                                {status === "COLLECTED" && "Wypożyczona"}
                                {status === "RETURNED" && "Zwrócona"}
                            </td>
                            <td>
                                {status === "RESERVED" && <button onClick={() => this.collectBook(id)}>ODBIERZ</button>}
                                {status === "COLLECTED" && <button onClick={() => this.returnBook(id)}>ZWRÓĆ</button>}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Reservations;