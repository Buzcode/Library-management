import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Navigation component with Bootstrap classes
const Navigation = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">LMS</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {user && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                            </li>
                        )}
                    </ul>
                    <div className="d-flex">
                        {user ? (
                            <>
                                <span className="navbar-text me-3">
                                    Hello, {user.Name} ({user.Role})
                                </span>
                                <button className="btn btn-outline-light" onClick={logout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                                <Link className="btn btn-primary" to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const HomePage = () => (
    <div className="container text-center mt-5">
        <h1>Welcome to the Library Management System</h1>
        <p className="lead">Your one-stop solution for managing books and members.</p>
    </div>
);

function App() {
    return (
        <div>
            <Navigation />
            <main className="container mt-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>
                    <Route path="*" element={<h3>404 - Page Not Found</h3>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;