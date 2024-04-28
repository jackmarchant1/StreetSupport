import React, {useState} from 'react';
import '../styles/Login.css';
import axios from "axios";
import { useAuth } from '../AuthContext';
import {Navigate, useNavigate} from 'react-router-dom';

function AmbassadorLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {isAuthenticated, login} = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const credentials = {email, password};

        try {
            const response = await axios.post('/api/ambassador/login', credentials, {withCredentials: true});
            if (response != null) {
                login(response.data.ambassador);
                navigate("/ambassador/dashboard");
            }
        } catch (error) {
            alert("Error logging in: " + error);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/ambassador/dashboard" replace />;
    }

    return (
        <div className="back-layer d-flex justify-content-center align-items-center">
            <h1 className="heading">Ambassador Portal</h1>
            <div className="form-container d-flex flex-column justify-content-center align-items-center p-5">
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <input type="email"
                               id="email"
                               className="form-control"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                        <label className="form-label" htmlFor="email">Email address</label>
                    </div>

                    <div className="mb-4">
                        <input type="password"
                               id="password"
                               className="form-control"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                        <label className="form-label" htmlFor="password">Password</label>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block mb-4">Log in</button>

                    <div className="row mb-4">
                        <a href="#!" className="col">Forgot password?</a>
                    </div>
                </form>
                <p>Want to sign your organisation up to Street Support? Submit a request to add your organisation
                    <a href="#"> here</a></p>
            </div>
        </div>
    );
}

export default AmbassadorLoginPage;