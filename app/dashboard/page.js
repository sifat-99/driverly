'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    // User data will now come from useAuth hook
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const { user, loading: authLoading, logout } = useAuth(); // Renamed loading to authLoading to avoid conflict
    const [dashboardLoading, setDashboardLoading] = useState(true); // Separate loading state for dashboard specific data

    console.log(user)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDashboardLoading(true);
                const response = await axios.get('/api/dashboard-data');
                // Assuming /api/dashboard-data might still provide bookings or other non-user specific data
                setBookings(response.data.bookings);
                setError('');
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError('Failed to load dashboard data. Please try again later.');
                setBookings([]);
            } finally {
                setDashboardLoading(false);
            }
        };

        fetchData();
    }, []);

    if (authLoading || dashboardLoading) { // Check both auth loading and dashboard data loading
        return (
            <div className="min-h-screen  text-white flex justify-center items-center">
                <p className="text-xl">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen  text-white flex justify-center items-center">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    if (!user) { // Check user from useAuth
        return (
            <div className="min-h-screen  text-white flex justify-center items-center">
                <p className="text-xl">Could not load user data.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen font-inter text-black"> {/* Removed padding here */}
            <div className="container mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-500">
                        Welcome, {user.name}!
                    </h1>
                </header>

                {/* User Profile Section */}
                <section id="user-profile" className="mb-12 p-6 h-[70vh] rounded-xl shadow-lg border border-gray-700"> {/* Added ID */}
                    <h2 className="text-3xl font-bold text-blue-400 mb-6">User Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400">Name:</p>
                            <p className="text-lg">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Email:</p>
                            <p className="text-lg">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Member Since:</p>
                            <p className="text-lg">{user.memberSince || 'N/A'}</p> {/* Assuming memberSince might not be on the auth user object */}
                        </div>
                    </div>
                    {/* Add more user details or an "Edit Profile" button here */}
                </section>


            </div>
        </div>
    );
}
