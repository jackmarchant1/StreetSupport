import React from 'react';
import { useAuth } from './AuthContext';
import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    console.log(isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/ambassador/login" replace />;
    }
    return children;
};
export default ProtectedRoute;