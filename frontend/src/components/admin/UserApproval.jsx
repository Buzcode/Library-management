// Filepath: frontend/src/components/admin/UserApproval.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function UserApproval() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });

    // useCallback helps prevent re-creating the function on every render
    const fetchPendingUsers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost/LIBRARY-MANAGEMENT/backend/api/users/read_pending.php');
            if (response.data.data) {
                setPendingUsers(response.data.data);
            } else {
                setPendingUsers([]); // Handle case where no pending users are found
            }
        } catch (error) {
            setMessage({ text: 'Error fetching users.', type: 'danger' });
            console.error('Error fetching pending users:', error);
        }
    }, []);

    // useEffect to run the fetch function when the component loads
    useEffect(() => {
        fetchPendingUsers();
    }, [fetchPendingUsers]);

    const handleApprove = async (userId) => {
        try {
            await axios.put('http://localhost/LIBRARY-MANAGEMENT/backend/api/users/approve.php', {
                Student_id: userId
            });
            setMessage({ text: 'User approved successfully!', type: 'success' });
            // Refresh the list of pending users after approval
            fetchPendingUsers();
        } catch (error) {
            setMessage({ text: 'Error approving user.', type: 'danger' });
            console.error('Error approving user:', error);
        }
    };

    return (
        <div>
            <h4>Approve New Users</h4>
            {message.text && (
                <div className={`alert alert-${message.type}`} role="alert">
                    {message.text}
                </div>
            )}
            {pendingUsers.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.map(user => (
                            <tr key={user.Student_id}>
                                <td>{user.Student_id}</td>
                                <td>{user.Name}</td>
                                <td>{user.Email}</td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleApprove(user.Student_id)}
                                    >
                                        Approve
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No pending user registrations.</p>
            )}
        </div>
    );
}

export default UserApproval;