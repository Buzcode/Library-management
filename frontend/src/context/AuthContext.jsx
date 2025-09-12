import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));

    const login = (userData) => {
        sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        // THE FIX IS HERE: We also reset the unread count in a separate storage
        // This ensures the next user who logs in starts with a fresh slate.
        localStorage.setItem('unreadCount', '0'); 
    };

    const value = { user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};