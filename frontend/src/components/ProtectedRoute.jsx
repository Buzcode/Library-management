// Filepath: frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user } = useAuth(); // Check for the user in our context

    // If there's no user, redirect to the login page.
    // The `replace` prop prevents the user from going back to the protected page with the back button.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If there is a user, render the child components.
    // <Outlet /> is a placeholder for the actual page component (e.g., DashboardPage).
    return <Outlet />;
};

export default ProtectedRoute;