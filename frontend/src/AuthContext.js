import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );

    const [organisationId, setOrganisationId] = useState(
        localStorage.getItem("organisationId") || null
    );

    const login = (orgId) => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        setOrganisationId(orgId);
        localStorage.setItem("organisationId", orgId);
    }

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.setItem("isAuthenticated", "false");
        setOrganisationId(null);
        localStorage.setItem("organisationId", null);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, organisationId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
