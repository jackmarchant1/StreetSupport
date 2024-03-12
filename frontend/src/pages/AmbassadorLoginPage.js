import React, {useState} from 'react';
import '../styles/Login.css';
import axios from "axios";
import { useAuth } from '../AuthContext';

function AmbassadorLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {changeAuthState} = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        //TODO: make it so can choose organisation, not just set ID
        const organisationId = "65eca2fe501f7ae0f48737dc";
        const credentials = {email, password, organisationId};
        try {
            const response = await axios.post('/api/ambassador/login', credentials, {withCredentials: true});
            if (response != null) {
                console.log("logged in ambassador")
                alert("Logged in ambassador " + response.data.email);
                changeAuthState(true);
            }
        } catch (error) {
            alert("Error logging in: " + error);
            changeAuthState(false)
        }
    };
    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/ambassador/isAuthenticated', { withCredentials: true });
            console.log("Logged in");

        } catch (error) {
            console.error("Error checking authentication:", error);
        }
    }

    return (
        <div className="back-layer d-flex justify-content-end">
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Log In</button>
            </form>
            <button onClick={checkAuth}>Log In</button>
        </div>
    );
}

export default AmbassadorLoginPage;