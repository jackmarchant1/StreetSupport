import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );


    // Mock function to change authentication status
    const changeAuthState = (state) => {
        setIsAuthenticated(state);
        localStorage.setItem("isAuthenticated", state);
        console.log("User authenticated");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, changeAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
