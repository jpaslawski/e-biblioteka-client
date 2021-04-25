import React from 'react';
import './Navbar.css';
import { Link, NavLink } from 'react-router-dom';
import { getUserPermissions, signOut } from '../../HelperMethods';
import { USER_PERMISSIONS } from '../../Constants';


const Navbar = ({ token }) => {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isProfileOptionsOpen, setProfileOptionsOpen] = React.useState(false);

    return (
        <nav>
            <div className="logo">
                <h4>eBiblioteka</h4>
            </div>
            <div className="burger" onClick={() => setIsMenuOpen(!isMenuOpen) }>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
            </div>
            <ul className={isMenuOpen ? "nav-active" : ""}>
                <li>
                    <NavLink to="/home" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Strona główna</NavLink>
                </li>
                <li>
                    <NavLink to="/books" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Książki</NavLink>
                </li>
                { token && <li>
                    <NavLink to="/reservations" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Rezerwacje</NavLink>
                </li>}
                { token && getUserPermissions(token) === USER_PERMISSIONS.admin && <li>
                    <NavLink to="/users" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Użytkownicy</NavLink>
                </li>}
                { token && <li className="profile-link" onClick={() => setProfileOptionsOpen(!isProfileOptionsOpen)}>
                    Profil <i className="fas fa-angle-down"></i>
                </li>}
                { isProfileOptionsOpen && <li className="profile-item">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Mój profil</Link>
                </li> }
                { isProfileOptionsOpen && <li className="profile-item">
                    <Link to="/home" onClick={() => {setIsMenuOpen(false); signOut()}}>Wyloguj się</Link>
                </li>}
                { !token && <li className="sign-in-link">
                    <Link to={{pathname:"/sign-in", state: {prevPath: window.location.pathname }}} onClick={() => setIsMenuOpen(false)}>Zaloguj się</Link>
                </li>}
                { !token && <li className="sign-up-link">
                    <Link to="/sign-up" onClick={() => setIsMenuOpen(false)}>Załóż konto</Link>
                </li>}
            </ul>
            { token ?
                <div className="profile" onClick={() => setProfileOptionsOpen(!isProfileOptionsOpen) }>
                    Profil <i className="fas fa-angle-down"></i>
                    <div className={ isProfileOptionsOpen ? "profile-options profile-options-active" : "profile-options"}>
                        <ul>
                            <li>
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Mój profil</Link>
                            </li>
                            <li onClick={() => signOut()}>Wyloguj się</li>
                        </ul>
                    </div>
                </div>
                :
                <div className="sign-container">
                    <div className="sign-in">
                        <Link to={{pathname:"/sign-in", state: {prevPath: window.location.pathname}}} onClick={() => setIsMenuOpen(false)}>Zaloguj się</Link>
                    </div>
                    <div className="sign-up">
                        <Link to="/sign-up" onClick={() => setIsMenuOpen(false)}>Załóż konto</Link>
                    </div>
                </div>}
        </nav>
    )
}

export default Navbar;