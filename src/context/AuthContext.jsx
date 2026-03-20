import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isAuthenticated = !!token;

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginApi(username, password);
            const jwt = res.data.token;
            localStorage.setItem('token', jwt);
            setToken(jwt);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Credenciales incorrectas');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout, loading, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
