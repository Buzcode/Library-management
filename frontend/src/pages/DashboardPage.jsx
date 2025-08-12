import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container } from 'react-bootstrap'; 

import AdminDashboard from '../components/dashboards/AdminDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';

function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return <div className="text-center p-5">Loading...</div>;
    }

    return (
        <Container fluid className="p-4">
            {user.Role === 'Librarian' ? <AdminDashboard /> : <StudentDashboard />}
        </Container>
    );
}

export default DashboardPage;