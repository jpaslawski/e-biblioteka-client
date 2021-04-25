import axios from 'axios';
import React from 'react';
import { USER_PERMISSIONS } from '../../Constants';
import { getUserPermissions, handleErrorResponse } from '../../HelperMethods';
import ModalForbidden from '../Modals/ModalForbidden';
import './Profile.css';

class User extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: this.props.match.params.userId,
            user: {},
            forbidden: false
        }

    }


    componentDidMount() {
        axios.get("/api/library/users/" + this.state.userId)
            .then(response => {
                this.setState({
                    user: response.data
                })
            })
            .catch(error => {
                this.setState({
                    message: handleErrorResponse(error.response)
                })
            });

        const userPermissions = getUserPermissions();
        if (sessionStorage.getItem("token") === null || userPermissions === USER_PERMISSIONS.student) {
            this.setState({
                forbidden: true
            })
        }
    }

    render() {

        let { user, forbidden } = this.state;

        return forbidden ?
            <ModalForbidden type={USER_PERMISSIONS.admin} />
            :
            <div className="content">
                {Object.keys(user).length > 0 ?
                    <div className="user-profile">
                        <div className="user-info">
                            <h2>Dane osobowe</h2>
                            <div className="user-item">
                                <label>Email:</label>
                                <input value={user.email} readOnly />
                            </div>
                            <div className="user-item">
                                <label>Imię:</label>
                                <input value={user.firstName} readOnly />
                            </div>
                            <div className="user-item">
                                <label>Nazwisko:</label>
                                <input value={user.lastName} readOnly />
                            </div>
                        </div>

                        <div className="user-contact">
                            <h2>Dane kontaktowe</h2>
                            <div className="user-item">
                                <label>Adres:</label>
                                <input name="address" value={user.address} readOnly />
                            </div>
                            <div className="user-item">
                                <label>Miejscowość:</label>
                                <input name="city" value={user.city} readOnly />
                            </div>
                            <div className="user-item">
                                <label>Kod pocztowy:</label>
                                <input name="zipCode" value={user.zipCode} readOnly />
                            </div>
                            <div className="user-item">
                                <label>Telefon:</label>
                                <input name="phoneNumber" value={user.phoneNumber} readOnly />
                            </div>
                        </div>
                    </div>
                    :
                    <h2 style={{ "textAlign": "center" }}>Nie znaleziono użytkownika.</h2>}
            </div>
    }
}

export default User;