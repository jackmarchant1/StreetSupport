import React, {useState} from 'react';
import '../styles/Login.css';
import axios from "axios";

function AmbassadorLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        const credentials = {username, password};
        try {
            const response = await axios.post('/api/ambassador/login', credentials);
            if (response != null) {
                alert("Logged in with credentials " + response.data.username + response.data.password);
            }
        } catch (error) {
            alert("Error logging in: " + error);
        }

    };

    return (
        <div className="back-layer d-flex justify-content-end">
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
        </div>
    );
}

export default AmbassadorLoginPage;