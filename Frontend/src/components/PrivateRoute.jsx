import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">Loading...</div>;
    }

    return currentUser ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
