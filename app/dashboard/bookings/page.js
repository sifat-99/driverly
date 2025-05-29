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

    useEffect(() => {
        const fetchData = async () => {
            // If authentication is still loading, we wait.
            // The effect will re-run when authLoading changes.
            if (authLoading) {
                setDashboardLoading(true);
                return;
            }
            if (!user || !user._id) {
                setDashboardLoading(false);
                setBookings([]);
                return;
            }

            setDashboardLoading(true);
            setError(''); // Clear previous errors
            try {
                console.log("Fetching bookings for User ID:", user._id);
                const response = await axios.get('/api/booking', {
                    params: { userId: user._id }
                });

                if (response.status === 200) {
                    setBookings(response?.data?.bookings || []); // Set bookings from response data
                } else {
                    setError(`Failed to load bookings (Status: ${response.status}). Please try again later.`);
                    setBookings([]);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                let errorMessage = 'Failed to load dashboard data. Please try again later.';
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response && err.response.statusText) {
                    errorMessage = `Failed to load dashboard data: ${err.response.statusText}`;
                }
                setError(errorMessage);
                setBookings([]);
            } finally {
                setDashboardLoading(false);
            }
        };
        fetchData();
    }, [user, authLoading]); // Re-run when user or authLoading changes

    const handlePayNow = async (bookingId) => {
        // In a real app, this would redirect to a payment gateway or open a payment modal.
        // For this example, we'll simulate a successful payment and update the status.
        try {
            setDashboardLoading(true); // Indicate an action is in progress
            const response = await axios.put('/api/booking', {
                bookingId: bookingId,
                paymentStatus: 'paid' // Or 'processing' then 'paid' after gateway confirmation
            });
            if (response.status === 200) {
                // Update the local state to reflect the change
                setBookings(prevBookings => prevBookings.map(b => b._id === bookingId ? { ...b, paymentStatus: 'paid', updatedAt: new Date().toISOString() } : b));
            }
        } catch (err) {
            console.error("Error processing payment:", err);
            setError(err.response?.data?.message || "Payment processing failed. Please try again.");
        } finally {
            setDashboardLoading(false);
        }
    };

    if (authLoading || dashboardLoading) { // Check both auth loading and dashboard data loading
        return (
            <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
                <p className="text-xl">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
                <p className="text-xl text-red-500 text-center">{error}</p>
                {/* Optionally, add a retry button if the error was related to data fetching */}
                {/* <button
                    onClick={fetchData} // Assuming fetchData is accessible or you re-trigger the effect
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                >
                    Try Again
                </button> */}
            </div>
        );
    }

    if (!user) { // Check user from useAuth
        return (
            <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
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

                {/* Booking History Section */}
                <section id="booking-history" className="p-6 rounded-xl shadow-lg border border-gray-700"> {/* Added ID */}
                    <h2 className="text-3xl font-bold text-blue-400 mb-6">Booking History</h2>
                    {bookings.length > 0 ? (
                        <div className="space-y-6">
                            {bookings.map((booking) => (
                                <div key={booking._id} className=" p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                                    <h3 className="text-xl font-semibold text-blue-300">{booking.carName}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                                        <p><span className="text-gray-500">Booking ID:</span> {booking._id}</p>
                                        <p><span className="text-gray-500">Booking Status:</span>
                                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${booking.status === 'Confirmed' ? 'bg-green-500 text-green-900' :
                                                booking.status === 'Completed' ? 'bg-blue-500 text-blue-900' :
                                                    booking.status === 'pending' ? 'bg-yellow-500 text-yellow-900' : 'bg-gray-500 text-gray-900' // Default for other statuses
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </p>
                                        <p><span className="text-gray-500">Payment Status:</span>
                                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${booking.paymentStatus === 'paid' ? 'bg-green-200 text-green-800' :
                                                    booking.paymentStatus === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                                        booking.paymentStatus === 'failed' ? 'bg-red-200 text-red-800' :
                                                            'bg-gray-200 text-gray-800'
                                                }`}>
                                                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                            </span>
                                        </p>
                                        <p><span className="text-gray-500">Total Fare:</span> ${booking.totalFare.toFixed(2)}</p>
                                        <p className="md:col-span-2"><span className="text-gray-500">Pickup:</span> {booking.pickupAddress} on {new Date(booking.pickupDate).toLocaleDateString()}</p>
                                        <p className="md:col-span-2"><span className="text-gray-500">Drop-off:</span> {booking.dropoffAddress} on {new Date(booking.dropoffDate).toLocaleDateString()}</p>

                                    </div>
                                    <div className="mt-4">
                                        {booking.paymentStatus === 'pending' && booking.status !== 'Cancelled' && (
                                            <button
                                                onClick={() => handlePayNow(booking._id)}
                                                className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                        {/* Other buttons like "View Details", "Cancel Booking" can go here */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">You have no booking history.</p>
                    )}
                </section>
            </div>
        </div>
    );
}
