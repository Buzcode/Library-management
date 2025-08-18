import React from 'react';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Name:</span> {user?.FirstName} {user?.LastName}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user?.Email}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;