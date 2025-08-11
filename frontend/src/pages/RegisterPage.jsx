// Filepath: frontend/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
    const [formData, setFormData] = useState({ Name: '', Email: '', Password: '' });
    // Let's improve our message state to handle success/error styling
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post('http://localhost/Library-management/backend/api/users/register.php', formData);
            setMessage({ text: response.data.message, type: 'success' });
        } catch (error) {
            setMessage({ text: 'Registration failed. Please try again.', type: 'danger' });
            console.error('There was an error registering!', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Register for an Account</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Name:</label>
                                    <input
                                        type="text"
                                        name="Name"
                                        className="form-control"
                                        value={formData.Name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        name="Email"
                                        className="form-control"
                                        value={formData.Email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        name="Password"
                                        className="form-control"
                                        value={formData.Password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Register</button>
                                </div>
                            </form>
                            {/* Use Bootstrap alerts for messages */}
                            {message.text && (
                                <div className={`alert alert-${message.type} mt-3`} role="alert">
                                    {message.text}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;