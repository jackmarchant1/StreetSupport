import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );

    const storedAmbassador = localStorage.getItem("ambassador");
    const [ambassador, setAmbassador] = useState(
        storedAmbassador ? JSON.parse(storedAmbassador) : null
    );

    const login = (ambassador) => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        setAmbassador(ambassador);
        localStorage.setItem("ambassador", JSON.stringify(ambassador));
    }

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.setItem("isAuthenticated", "false");
        setAmbassador(null);
        localStorage.setItem("ambassador", null);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, ambassador, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
