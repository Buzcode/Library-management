import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // State to hold the user data. 
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    // Function to handle login
    const login = (userData) => {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        // Set the user state
        setUser(userData);
    };

    // Function to handle logout
    const logout = () => {
        // Remove user data from localStorage
        localStorage.removeItem('user');
        // Set the user state to null
        setUser(null);
    };

    // The value that will be available to all consuming components
    const value = {
        user,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};