'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const { login: authLogin } = useAuth(); // Renamed to avoid conflict
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        setLoading(true);
        try {
            const response = await authLogin(email, password);
            setMessage(response.data.message);
            setMessageType('success');
            router.push('/dashboard');
        } catch (err) {
            setMessage(err.response?.data?.message || 'An error occurred during login.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-white flex flex-col items-center justify-center p-4 font-inter">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-red-500">
                        Sign In
                    </h1>
                    <p className="text-black mt-2">Welcome back to DriverLy!</p>
                </header>

                {message && (
                    <div
                        className={`text-white p-3 rounded-md mb-6 text-center ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 text-black">
                    <div>
                        <label htmlFor="email" className="block  text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-transparent text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block  text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-transparent text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        {/* Add "Forgot password?" link here if needed */}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-red-600 hover:cursor-pointer text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <p className="text-center text-red-400 text-sm mt-8">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
