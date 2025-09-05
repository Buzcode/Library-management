import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user } = useAuth(); // Check for the user 

    // If there's no user, redirect to the login page.
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If there is a user, render the child components.
    // <Outlet /> is a placeholder for the actual page component
    return <Outlet />;
};

export default ProtectedRoute;