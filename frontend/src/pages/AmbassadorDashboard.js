import React from 'react';
import { useAuth } from '../AuthContext';


function AmbassadorDashboard() {
    const {changeAuthState} = useAuth();
    const logout = () => {
        changeAuthState(false);
    }
    return (
        <>
            <div>Welcome</div>
            <button onClick={logout}>Log out</button>
        </>

    );
}

export default AmbassadorDashboard;