// Filepath: frontend/src/components/dashboards/StudentDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

function StudentDashboard() {
    const { user } = useAuth();
    return <h2>Welcome, {user.Name}! This is the student dashboard.</h2>;
}

export default StudentDashboard;