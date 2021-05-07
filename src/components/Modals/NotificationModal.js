import { RESERVATION_STATUS } from "../../Constants";

const NotificationModal = ({ notifications, handleModal }) => {

    return (
        <div className="modal">
            <div className="modal-container">
                <i className="fas fa-times" onClick={() => { handleModal(); sessionStorage.setItem("showNotifications", false)} }></i>
                <div>
                    { notifications && notifications.map(({ bookName, status, timeLeft }) => (
                        <div className="notification" key={ bookName }>
                            <h2>{ bookName }</h2>
                            { status === RESERVATION_STATUS.returned && <div>Rezerwacja przepadła, ponieważ książka nie została odebrana w ciągu 2 dni.</div> }
                            { timeLeft === 0 && <div>Termin twojej rezerwacji dobiegł końca. Zwróć książkę jak najszybciej, aby nie zostały wyciągnięte konsekwencje.</div> }
                            { timeLeft > 0 && <div>Zbliża się termin zwrotu książki! Zwróć ją w ciągu { timeLeft } { timeLeft > 1 ? "dni" : "dnia" }.</div> }
                        </div>
                    ))}
                </div>
            </div>
        </div>)
}
export default NotificationModal;