import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: sessionStorage.getItem('token') || null,
        role: null,
    });

    useEffect(() => {
        if (auth.token) {
            const decoded = jwtDecode(auth.token);
            setAuth((prevAuth) => ({ ...prevAuth, role: decoded.role }));
        }
    }, [auth.token]);

    const login = (token) => {
        sessionStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setAuth({ token, role: decoded.role });
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setAuth({ token: null, role: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
