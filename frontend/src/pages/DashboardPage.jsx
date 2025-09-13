import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import AdminDashboard from '../components/dashboards/AdminDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';

function DashboardPage() {
    const { user, loading } = useAuth(); 

    // If the authentication state is still being determined, show a loading message
    // This prevents a brief flash of the login page on refresh for logged-in users
    if (loading) {
        return <div className="text-center p-5">Loading user session...</div>;
    }

    // After loading, if there is still no user, they are not authenticated.
    // Redirect them to the login page.
    if (!user) {
        return <Navigate to="/login" replace />;
    }


    let dashboardToRender;

    if (user.Role === 'Librarian') {
        dashboardToRender = <AdminDashboard />;
    } else if (user.Role === 'Student') {
        dashboardToRender = <StudentDashboard />;
    } else {
        // This is a crucial fallback. If the user's role is not one of the above

        console.error("DashboardPage: Unauthorized or unknown user role:", user.Role);
        return <Navigate to="/login" replace />;
    }

    return (
        <Container fluid className="p-4">
            {dashboardToRender}
        </Container>
    );
}

export default DashboardPage;