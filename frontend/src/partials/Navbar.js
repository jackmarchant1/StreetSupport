import React from 'react';
import { useAuth } from '../AuthContext';
const NavBar = () => {
    const {ambassador, logout} = useAuth();
    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <a className="navbar-brand" href="/">Street Support</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown">
                        <a className="nav-link" href="#" id="navbarDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {ambassador.name}
                            <i className="bi bi-person-circle px-1"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="#">My Account</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#" onClick={logout}>Logout</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
