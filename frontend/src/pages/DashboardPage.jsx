import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

// Assuming your dashboard components are in this path
import AdminDashboard from '../components/dashboards/AdminDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';

function DashboardPage() {
    const { user, loading } = useAuth(); // Assuming your context might have a loading state

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

    // --- IMPORTANT ---
    // The property name 'Role' must EXACTLY match the key in the JSON object
    // returned by your login.php script. If PHP returns {"role": "Librarian"},
    // then you must use user.role (lowercase 'r').
    // Based on your code, I am assuming it is user.Role (uppercase 'R').

    let dashboardToRender;

    if (user.Role === 'Librarian') {
        dashboardToRender = <AdminDashboard />;
    } else if (user.Role === 'Student') {
        dashboardToRender = <StudentDashboard />;
    } else {
        // This is a crucial fallback. If the user's role is not one of the above
        // (e.g., 'Pending' or null), log the issue and redirect them away.
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