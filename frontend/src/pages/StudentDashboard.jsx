import React from 'react';
import { useAuth } from '../context/AuthContext';
import MyProfile from '../components/MyProfile';
import LoanHistory from '../components/LoanHistory';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.FirstName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <MyProfile />
        </div>
        <div className="md:col-span-2">
          <LoanHistory /> {/* Add the component here */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;