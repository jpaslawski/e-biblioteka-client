import React from 'react';
import './SignForms.css';
import axios from 'axios';
import { handleErrorResponse, redirectHome } from '../../HelperMethods';

class SignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            password: undefined,
            repassword: undefined,
            address: undefined,
            city: undefined,
            zipCode: undefined,
            phoneNumber: undefined,
            isNextFormSelected: false,
            errorMessage: undefined
        }

        this.signUp = this.signUp.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    signUp() {
        const data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            address: this.state.address,
            city: this.state.city,
            zipCode: this.state.zipCode,
            phoneNumber: this.state.phoneNumber
        }

        axios.post("/api/register", data)
        .then(response => {
            window.location.href = "/sign-in";
        })
        .catch(error => {
            this.setState({
                errorMessage: handleErrorResponse(error.response)
            });
        });
    }

    selectPreviousForm() {
        this.setState({
            isNextFormSelected: false
        })
    }

    selectNextForm() {
        if (this.state.password === this.state.repassword) {
            if(this.state.password.length > 7) {
                this.setState({
                    isNextFormSelected: true,
                    errorMessage: undefined
                })
            } else {
                this.setState({
                    errorMessage: "Hasło jest za krótkie! Powinno składać się z co najmniej 8 znaków."
                })
            }
        } else {
            this.setState({
                errorMessage: "Hasła się różnią!"
            })
        }
    }

    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        })
    }

    componentDidMount() {
        if (sessionStorage.getItem("token") !== null) {
            redirectHome()
        }
    }

    render() {

        let { firstName, lastName, email, password, repassword, address, city, zipCode, phoneNumber, isNextFormSelected, errorMessage } = this.state;

        return (
            <div className="content">
                <div className="sign-form">
                    <h2>Tworzenie nowego konta</h2>
                    <div className={`user-info ${isNextFormSelected ? "slide-out-left" : "slide-in-right"}`}>
                        <input type="text" name="firstName" placeholder="IMIĘ" onChange={this.handleOnChange}></input>
                        <input type="text" name="lastName" placeholder="NAZWISKO" onChange={this.handleOnChange}></input>
                        <input type="text" name="email" placeholder="E-MAIL" onChange={this.handleOnChange}></input>
                        <input type="password" name="password" placeholder="HASŁO"  minLength="8" maxLength="16" onChange={this.handleOnChange}></input>
                        <input type="password" name="repassword" placeholder="POWTÓRZ HASŁO" minLength="8" maxLength="16" onChange={this.handleOnChange}></input>
                        
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <button disabled={!firstName || !lastName || !email || !password || !repassword} onClick={() => this.selectNextForm()} >Dalej</button>
                    </div>
                    
                    <div className={`user-contact ${isNextFormSelected ? "slide-in-left" : "slide-out-right"}`}>
                        <input type="text" name="address" placeholder="ADRES" onChange={this.handleOnChange}></input>
                        <input type="text" name="city" placeholder="MIEJSCOWOŚĆ" onChange={this.handleOnChange}></input>
                        <input type="text" name="zipCode" placeholder="KOD POCZTOWY" pattern="\d*" maxLength="5" onChange={this.handleOnChange}></input>
                        <input type="text" name="phoneNumber" placeholder="NUMER TELEFONU" pattern="\d*" maxLength="9" onChange={this.handleOnChange}></input>
                        
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <button className="secondary" onClick={() => this.selectPreviousForm()} >Wróć</button>
                        <button disabled={!address || !city || !zipCode || !phoneNumber} onClick={this.signUp}>Załóż konto</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;