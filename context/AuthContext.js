'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get('/api/me');
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
            // Uncommented and enhanced for better debugging:
            console.error(
                'AuthContext: Failed to fetch user or not authenticated. Error:',
                error.response ? { status: error.response.status, data: error.response.data } : error.message
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email, password) => {
        const response = await axios.post('/api/login', { email, password });
        await fetchUser(); // Refetch user after login
        return response;
    };

    const register = async (userData) => {
        const response = await axios.post('/api/register', userData);
        await fetchUser(); // Refetch user after registration (if auto-login)
        return response;
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
