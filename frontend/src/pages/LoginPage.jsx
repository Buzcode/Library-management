// Filepath: frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [formData, setFormData] = useState({ Email: '', Password: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post('http://localhost/Library-management/backend/api/users/login.php', formData);
            if (response.data.data) {
                login(response.data.data);
                navigate('/dashboard');
            } else {
                setMessage({ text: response.data.message, type: 'danger' });
            }
        } catch (error) {
            setMessage({ text: 'Login failed. Please check your credentials.', type: 'danger' });
            console.error('There was an error logging in!', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login</h2>
                            <form onSubmit={handleSubmit}>
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
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                            </form>
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

export default LoginPage;