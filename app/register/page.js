'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    const { register: authRegister } = useAuth(); // Renamed to avoid conflict
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setMessageType('error');
            return;
        }

        setLoading(true);
        try {
            const response = await authRegister({
                name,
                email,
                password,
                confirmPassword
            });
            setMessage(response.data.message);
            setMessageType('success');
            // Redirect to dashboard after successful registration and auto-login
            router.push('/dashboard');
        } catch (err) {
            setMessage(err.response?.data?.message || 'An error occurred during registration.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-white flex flex-col items-center justify-center p-4 font-inter">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-blue-500">
                        Create Account
                    </h1>
                    <p className="text-gray-400 mt-2">Join DriverLy today!</p>
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
                        <label htmlFor="name" className="block  text-sm font-bold mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-white text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block  text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4  text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4  text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block  text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4  text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-red-600 hover:cursor-pointer text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>
                <p className="text-center  text-red-400 text-sm mt-8">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
