import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );


    // Changes authentication state
    const changeAuthState = (state) => {
        setIsAuthenticated(state);
        localStorage.setItem("isAuthenticated", state);
        console.log("User changed authentication state");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, changeAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
