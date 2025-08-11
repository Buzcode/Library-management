// Filepath: frontend/src/pages/DashboardPage.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';

// We'll create these components in the next steps
import AdminDashboard from '../components/dashboards/AdminDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';

function DashboardPage() {
    const { user } = useAuth();

    // Render nothing if user data is not yet available
    if (!user) {
        return null;
    }

    // Conditionally render the dashboard based on the user's role
    return (
        <div>
            {user.Role === 'Librarian' ? <AdminDashboard /> : <StudentDashboard />}
        </div>
    );
}

export default DashboardPage;