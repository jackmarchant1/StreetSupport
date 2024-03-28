import React from 'react';
import { useAuth } from './AuthContext';
import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({ children }) => { //Any element requiring log in wrap in this
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/ambassador/login" replace />;
    }
    return children;
};
export default ProtectedRoute;