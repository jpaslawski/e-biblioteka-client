import axios from 'axios';
import React from 'react';
import { handleErrorResponse } from '../../HelperMethods';
import MessageModal from '../Modals/MessageModal';
import ModalForbidden from '../Modals/ModalForbidden';
import './Profile.css';

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userInfo: {},
            userContact: {},
            newPassword: undefined,
            repassword: undefined,
            address: undefined,
            city: undefined,
            zipCode: undefined,
            phoneNumber: undefined,
            isModalOpen: false,
            isPasswordModalOpen: false,
            message: undefined,
            forbidden: false
        }

        // API call functions
        this.saveUserContact = this.saveUserContact.bind(this);
        this.updateUserPassword = this.updateUserPassword.bind(this);

        // Handlers
        this.handleOnChange = this.handleOnChange.bind(this);
        this.setModalStatus = this.setModalStatus.bind(this);
    }

    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        })
    }

    setModalStatus(status) {
        this.setState({
            isModalOpen: status,
            message: undefined
        })
    }

    setPasswordModalStatus(status) {
        this.setState({
            isPasswordModalOpen: status
        })
    }

    updateUserPassword() {
        if (this.state.newPassword === this.state.repassword) {
            if (this.state.newPassword.length > 7) {
                const data = {
                    email: this.state.userInfo.email,
                    firstName: this.state.userInfo.firstName,
                    lastName: this.state.userInfo.lastName,
                    password: this.state.newPassword
                }

                axios.put("/api/users/profile", data)
                    .then(() => {
                        this.setState({
                            message: "Hasło zostało pomyślnie zaktualizowane!",
                            isPasswordModalOpen: false,
                            isModalOpen: true
                        })
                    })
                    .catch(error => {
                        this.setState({
                            message: handleErrorResponse(error.response)
                        })
                    });
            } else {
                this.setState({
                    message: "Hasło jest za krótkie!"
                })
            }
        } else {
            this.setState({
                message: "Hasła się różnią!"
            })
        }
    }

    saveUserContact() {
        const data = {
            address: this.state.address,
            city: this.state.city,
            zipCode: this.state.zipCode,
            phoneNumber: this.state.phoneNumber
        }

        axios.put("/api/users/contact", data)
            .then(() => {
                this.setState({
                    message: "Dane kontaktowy zostały pomyślnie zaktualizowane!",
                    isModalOpen: true
                })
            })
            .catch(error => {
                this.setState({
                    message: handleErrorResponse(error.response)
                })
            });
    }

    componentDidMount() {
        axios.get("/api/users/profile")
            .then(response => {
                this.setState({
                    userInfo: response.data
                })
            })
            .catch(error => {
                this.setState({
                    message: handleErrorResponse(error.response)
                })
            });

        axios.get("/api/users/contact")
            .then(response => {
                const userContact = response.data;
                this.setState({
                    address: userContact.address,
                    city: userContact.city,
                    zipCode: userContact.zipCode,
                    phoneNumber: userContact.phoneNumber
                })
            })
            .catch(error => {
                this.setState({
                    message: handleErrorResponse(error.response)
                })
            });

        if (sessionStorage.getItem("token") === null) {
            this.setState({
                forbidden: true
            })
        }
    }

    render() {

        let { userInfo, newPassword, repassword, address, city, zipCode, phoneNumber } = this.state;

        let { isModalOpen, isPasswordModalOpen, message, forbidden } = this.state;

        return forbidden ?
            <ModalForbidden />
            :
            (<div className="content">
                { isModalOpen && <MessageModal message={ message } setModalStatus={ this.setModalStatus } /> }
                { isPasswordModalOpen && <div className="modal">
                    <div className="modal-container">
                        <i className="fas fa-times" onClick={() => this.setPasswordModalStatus(false)}></i>
                        <div className="sign-form">
                            <h2>Zmiana hasła</h2>
                            <input type="password" name="newPassword" placeholder="HASŁO" minLength="8" maxLength="16" onChange={this.handleOnChange}></input>
                            <input type="password" name="repassword" placeholder="POWTÓRZ HASŁO" minLength="8" maxLength="16" onChange={this.handleOnChange}></input>

                            {message && <div className="error-message">{message}</div>}
                            <button disabled={!newPassword || !repassword} onClick={this.updateUserPassword}>Zapisz</button>
                        </div>
                    </div>
                </div>}
                <div className="user-profile">
                    <div className="user-info">
                        <h2>Dane osobowe</h2>
                        <div className="user-item">
                            <label>Email:</label>
                            <input value={userInfo.email} readOnly />
                        </div>
                        <div className="user-item">
                            <label>Imię:</label>
                            <input value={userInfo.firstName} readOnly />
                        </div>
                        <div className="user-item">
                            <label>Nazwisko:</label>
                            <input value={userInfo.lastName} readOnly />
                        </div>
                        <div className="button-container">
                            <button onClick={() => this.setPasswordModalStatus(true)}>Zmień hasło</button>
                        </div>
                    </div>

                    <div className="user-contact">
                        <h2>Dane kontaktowe</h2>
                        <div className="user-item">
                            <label>Adres:</label>
                            <input type="text" name="address" value={address} autoComplete="off1" onChange={this.handleOnChange} />
                        </div>
                        <div className="user-item">
                            <label>Miejscowość:</label>
                            <input type="text" name="city" value={city} autoComplete="off2" onChange={this.handleOnChange} />
                        </div>
                        <div className="user-item">
                            <label>Kod pocztowy:</label>
                            <input type="text" name="zipCode" value={zipCode} pattern="\d*" maxLength="5" autoComplete="off3" onChange={this.handleOnChange} />
                        </div>
                        <div className="user-item">
                            <label>Telefon:</label>
                            <input type="text" name="phoneNumber" value={phoneNumber} pattern="\d*" maxLength="9" autoComplete="off4" onChange={this.handleOnChange} />
                        </div>
                        <div className="button-container">
                            <button onClick={this.saveUserContact}>Zapisz</button>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}

export default Profile;