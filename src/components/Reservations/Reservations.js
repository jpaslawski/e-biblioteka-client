import React from 'react';
import './Reservations.css';
import axios from 'axios';
import { getUserPermissions, handleErrorResponse } from '../../HelperMethods';
import { RESERVATION_STATUS, USER_PERMISSIONS } from '../../Constants';
import ModalForbidden from '../Modals/ModalForbidden';
import UserTable from './UserTable';
import AdminTable from './AdminTable';
import MessageModal from '../Modals/MessageModal';

class Reservations extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            bookId: this.props.match.params.bookId,
            reservations: [],
            displayedReservations: [],
            statusSet: [],
            isModalOpen: false,
            message: undefined,
            forbidden: false
        }

        // API call functions
        this.changeBookStatus = this.changeBookStatus.bind(this);

        // Handlers
        this.setModalStatus = this.setModalStatus.bind(this);
    }

    handleFilter(status) {
        let statusFilter = this.state.statusSet;
        statusFilter.includes(status) ? statusFilter.pop(status) : statusFilter.push(status);
        
        // Filter reservations by selected filters
        if (statusFilter.length > 0) {
            this.setState({
                statusSet: statusFilter,
                displayedReservations: this.state.reservations.filter((reservation) => {
                    return statusFilter.includes(reservation.status)
                })
            })
        } 
        // Show all resrvations if no filters
        else {
            this.setState({
                displayedReservations: this.state.reservations
            })
        }
    }

    clearFilter() {
        this.setState({
            statusSet: [],
            displayedReservations: this.state.reservations
        })
    }

    setModalStatus(status) {
        this.setState({
            isModalOpen: status
        })
    }

    changeBookStatus(reservationId, status) {
        axios.put("/api/reservations/" + reservationId + "?newStatus=" + status)
            .then(response => {
                // Save updated reservation
                const updatedReservation = response.data;

                // Update reservation set
                let { reservations } = this.state;
                reservations[reservations.findIndex(x => x.id === updatedReservation.id)] = updatedReservation;

                let message = "";
                if (status === RESERVATION_STATUS.collected) {
                    message = "Pomy??lnie odebrano ksi????k??! Pami??taj, aby zwr??ci?? j?? do 30 dni.";
                } else {
                    message = "Dzi??kujemy za zwrot ksi????ki.";
                }

                this.setState({
                    reservations: reservations.slice(),
                    displayedReservations: reservations.slice(),
                    isModalOpen: true,
                    message: message
                })
            })
            .catch(error => {
                this.setState({
                    isModalOpen: true,
                    message: handleErrorResponse(error.response)
                })
            });
    }

    componentDidMount() {
        const userPermissions = getUserPermissions();
        if (userPermissions === USER_PERMISSIONS.admin || userPermissions === USER_PERMISSIONS.librarian) {
            axios.get("/api/library/reservations")
                .then(response => {
                    const data = response.data;
                    this.setState({
                        reservations: data.slice(),
                        displayedReservations: data.slice()
                    })
                })
                .catch(error => {
                    this.setState({
                        isModalOpen: true,
                        message: handleErrorResponse(error.response)
                    })
                });
        } else {
            axios.get("/api/reservations")
                .then(response => {
                    const data = response.data;
                    this.setState({
                        reservations: data.slice(),
                        displayedReservations: data.slice()
                    })
                })
                .catch(error => {
                    this.setState({
                        isModalOpen: true,
                        message: handleErrorResponse(error.response)
                    })
                });
        }

        if (sessionStorage.getItem("token") === null) {
            this.setState({
                forbidden: true
            })
        }
    }

    render() {

        let { displayedReservations, statusSet, isModalOpen, message, forbidden } = this.state;

        const userPermissions = getUserPermissions();

        return forbidden ?
            <ModalForbidden />
            :
            (<div className="content">
                {isModalOpen && <MessageModal message={ message } setModalStatus={this.setModalStatus} /> }
                <div className="filter">
                    <span>Status:</span>
                    <div className="filter-container">
                        <div className="filter-item">
                            <input type="checkbox" name="RESERVED"
                                onChange={() => this.handleFilter(RESERVATION_STATUS.reserved)}
                                checked={statusSet.includes(RESERVATION_STATUS.reserved)} />
                            <label htmlFor="RESERVED">Gotowe do odbioru</label>
                        </div>
                        <div className="filter-item">
                            <input type="checkbox" name="COLLECTED"
                                onChange={() => this.handleFilter(RESERVATION_STATUS.collected)}
                                checked={statusSet.includes(RESERVATION_STATUS.collected)} />
                            <label htmlFor="COLLECTED">Wypo??yczone</label>
                        </div>
                        <div className="filter-item">
                            <input type="checkbox" name="RETURNED"
                                onChange={() => this.handleFilter(RESERVATION_STATUS.returned)}
                                checked={statusSet.includes(RESERVATION_STATUS.returned)} />
                            <label htmlFor="RETURNED">Zwr??cone</label>
                        </div>
                    </div>
                    <div className="button-group" style={{ "marginTop": "10px" }}>
                        <button onClick={() => this.clearFilter()}>Wyczy????</button>
                    </div>
                </div>
                { displayedReservations.length > 0 ?
                    <div>
                        { userPermissions === USER_PERMISSIONS.student ?
                            <UserTable
                                displayedReservations={displayedReservations}
                                changeBookStatus={this.changeBookStatus} />
                            :
                            <AdminTable
                                displayedReservations={displayedReservations} />
                        }
                    </div>
                    :
                    <div className="no-content">Nie znaleziono ??adnych rezerwacji...</div>}
            </div>
            )
    }
}

export default Reservations;