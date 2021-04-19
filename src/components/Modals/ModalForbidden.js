import React from 'react';
import { Link } from 'react-router-dom';
import { USER_PERMISSIONS } from '../../Constants';

const ModalForbidden = ({ type }) => {

    return (
        <div className="modal">
            <div className="modal-container">
                <h2>BŁĄD 403</h2>
                { type && type === USER_PERMISSIONS.admin ?
                    <div>Dostęp do tej strony jest zarezerwowany dla użytkowników o wyższych uprawnieniach.</div>
                    :
                    <div>Dostęp do tej strony mają tylko użytkownicy zalogowani.</div>}
                { type && type === USER_PERMISSIONS.admin ? 
                    <button><Link to={{ pathname: "/home", state: { prevPath: window.location.pathname } }} >Strona główna</Link></button>
                    :
                    <button><Link to={{ pathname: "/sign-in", state: { prevPath: window.location.pathname } }} >Zaloguj się</Link></button>}
            </div>
        </div>
    )
}

export default ModalForbidden;