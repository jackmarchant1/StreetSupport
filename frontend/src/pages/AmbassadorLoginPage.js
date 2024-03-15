import React, {useState} from 'react';
import '../styles/Login.css';
import axios from "axios";
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function AmbassadorLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {changeAuthState} = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        //TODO: make it so can choose organisation, not just set ID
        const organisationId = "65eca2fe501f7ae0f48737dc";
        const credentials = {email, password, organisationId};

        try {
            const response = await axios.post('/api/ambassador/login', credentials, {withCredentials: true});
            if (response != null) {
                console.log("Logged in ambassador")
                changeAuthState(true);
                navigate("/ambassador/dashboard");
            }
        } catch (error) {
            alert("Error logging in: " + error);
            changeAuthState(false)
        }
    };

    return (
        <div className="back-layer d-flex justify-content-center align-items-center">
            <div className="form-container p-5">
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

                    <div className="row mb-2">
                        <div className="col d-flex justify-content-center">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="rememberCheck"
                                       checked/>
                                <label className="form-check-label" htmlFor="rememberCheck"> Remember me </label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <a href="#!" className="col">Forgot password?</a>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mb-4">Log in</button>
                </form>
            </div>
        </div>
    );
}

export default AmbassadorLoginPage;