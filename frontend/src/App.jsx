import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Button } from 'react-bootstrap';
import './App.css';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';

import Chat from './components/Chat';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
            <div className="container-fluid">
                <Link className="navbar-brand-custom" to="/">
                    <span className="navbar-brand-title">Your Library</span>
                    <span className="navbar-brand-subtitle">Read it, love it, return it</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* You can remove this nav-item if the dot is not needed */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/"></Link> 
                        </li>
                        {user && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                            </li>
                        )}
                    </ul>
                    <div className="d-flex align-items-center">
                        {user ? (
                            <>
                                <span className="navbar-text me-3">
                                    Hello, {user.Name} ({user.Role})
                                </span>
                                <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                {/* --- CHANGE: Updated classNames for correct button styling --- */}
                                <Link className="btn-header-login me-2" to="/login">Login</Link>
                                <Link className="btn-header-signup" to="/register">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

function App() {
    const { user } = useAuth();

    return (
        <div>
            <Navigation />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>
                    <Route path="*" element={<h3 className="text-center mt-5">404 - Page Not Found</h3>} />
                </Routes>
            </main>

            {user && <Chat key={user.Student_id} />}
        </div>
    );
}

export default App;