import { Component } from "react";
import axios from 'axios';
import { getUserPermissions, handleErrorResponse, transformUserRole } from '../../HelperMethods';
import { USER_PERMISSIONS } from "../../Constants";
import ModalForbidden from '../Modals/ModalForbidden';
import MessageModal from "../Modals/MessageModal";

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            forbidden: false,
            isModalOpen: false,
            errorMessage: undefined
        }

        // API call functions
        this.updateUserRole = this.updateUserRole.bind(this);

        // Handlers
        this.setModalStatus = this.setModalStatus.bind(this);
    }

    updateUserRole(userId, role) {
        axios.put("/api/admin/users/ " + userId + "?newRole=" + role)
        .then(response => {
            let { users } = this.state;
            let userIndex = users.findIndex((obj => obj.id === userId));
            users[userIndex] = response.data;
            this.setState({
                users: users,
                errorMessage: "Uprawnienia użytkownika zaktualizowano pomyślnie!",
                isModalOpen: true
            })
        })
        .catch(error => {
            this.setState({
                errorMessage: handleErrorResponse(error.response)
            })
        });
    }

    setModalStatus(status) {
        this.setState({
            isModalOpen: status,
            errorMessage: undefined
        })
    }

    componentDidMount() {
        axios.get("/api/admin/users")
            .then(response => {
                this.setState({
                    users: response.data
                })
            })
            .catch(error => {
                this.setState({
                    errorMessage: handleErrorResponse(error.response)
                })
            });

        const userPermissions = getUserPermissions();
        if (sessionStorage.getItem("token") === null || [USER_PERMISSIONS.student, USER_PERMISSIONS.librarian].includes(userPermissions)) {
            this.setState({
                forbidden: true
            })
        }
    }

    render() {

        let { users, forbidden, isModalOpen, errorMessage } = this.state;

        return forbidden ?
            <ModalForbidden type={USER_PERMISSIONS.admin} />
            :
            <div className="content">
                { isModalOpen && <MessageModal message={errorMessage} setModalStatus={this.setModalStatus} /> }
                <table>
                    <thead>
                        <tr>
                            <th>Imie i Nazwisko</th>
                            <th>Email</th>
                            <th>Uprawnienia</th>
                            <th>Działania</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map(({ id, firstName, lastName, email, role }) => (
                            <tr key={ id }>
                                <td>
                                    <a href={"/users/" + id}>{firstName} {lastName}</a>
                                </td>
                                <td>{email}</td>
                                <td>{ transformUserRole(role) }</td>
                                <td>
                                    {role === USER_PERMISSIONS.student && <button className="green" onClick={() => this.updateUserRole(id, "LIBRARIAN")}>Mianuj bibliotekarzem</button>}
                                    {role === USER_PERMISSIONS.librarian && <button className="red" onClick={() => this.updateUserRole(id, "STUDENT")}>Zmniejsz uprawnienia</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    }
}
export default UserList;