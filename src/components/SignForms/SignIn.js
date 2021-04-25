import React from 'react';
import './SignForms.css';
import axios from 'axios';
import { handleErrorResponse, redirectHome } from '../../HelperMethods';

class SignIn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: undefined,
            password: undefined,
            errorMessage: undefined
        }

        this.handleOnChange = this.handleOnChange.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    handleOnChange(element) {
        this.setState({
            [element.target.name]: element.target.value
        })
    }

    signIn() {
        if (this.state.email && this.state.password) {

            const credentials = {
                email: this.state.email,
                password: this.state.password
            }

            axios.post("/api/authenticate", credentials)
                .then(response => {
                    sessionStorage.setItem("token", response.data.token);
                    axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.token;

                    if(this.props.location.state !== undefined) {
                        const { prevPath } = this.props.location.state;
                        window.location.href = prevPath;
                    } else {
                        window.location.href = "/home"
                    }
                })
                .catch(error => {
                    this.setState({
                        errorMessage: handleErrorResponse(error.response)
                    });
                });
        } else {
            this.setState({
                errorMessage: "Wypełnij wszystkie pola!"
            });
        }
    }

    componentDidMount() {
        if (sessionStorage.getItem("token") !== null) {
            redirectHome()
        }
    }

    render() {
        let { email, password, errorMessage } = this.state;

        return (
            <div className="content">
                <div className="sign-form">
                    <h2>Logowanie</h2>
                    <input type="text" name="email" placeholder="E-MAIL" autoComplete="new-off" onChange={this.handleOnChange}/>
                    <input type="password" name="password" placeholder="HASŁO" onChange={this.handleOnChange} />

                    { errorMessage && <div className="error-message">{errorMessage}</div> }

                    <button disabled={ !email || !password } onClick={this.signIn}>Zaloguj się</button>
                </div>
            </div>
        )
    }
}

export default SignIn;