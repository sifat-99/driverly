'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // For potential redirects

// Define possible booking statuses for consistency
const BOOKING_STATUSES = {
    PENDING: 'pending',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled', // A status for admin/user cancellation
};

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true); // General loading for the page
    const [error, setError] = useState('');
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const fetchAllBookings = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/api/admin/bookings'); // Use the new admin-specific endpoint
            setBookings(response.data.bookings || []);
        } catch (err) {
            console.error("Error fetching all bookings for admin:", err);
            let errorMessage = 'Failed to load bookings.';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.statusText) {
                errorMessage = `Failed to load bookings: ${err.response.statusText}`;
            }
            setError(errorMessage);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authLoading) {
            // setLoading(true) is implicitly handled by initial state or previous conditional rendering
            return; // Wait for authentication to resolve
        }

        if (!user) {
            setError("Access Denied. Please log in.");
            setLoading(false);
            // Optionally redirect: router.push('/login');
            return;
        }

        // IMPORTANT: Replace 'user.role === "admin"' with your actual admin check logic
        const currentUserIsAdmin = user?.role === 'admin';

        if (!currentUserIsAdmin) {
            setError('Access Denied. You are not authorized to view this page.');
            setLoading(false);
            // Optionally redirect: router.push('/dashboard'); // or a generic unauthorized page
            return;
        }

        // If user is authenticated and is an admin, fetch bookings
        fetchAllBookings();

    }, [user, authLoading, fetchAllBookings, router]);

    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            // Uses the existing PUT /api/booking endpoint
            await axios.put('/api/booking', { bookingId, status: newStatus });
            setBookings(prevBookings =>
                prevBookings.map(b => b._id === bookingId ? { ...b, status: newStatus, updatedAt: new Date().toISOString() } : b)
            );
            // Consider adding a success notification (e.g., toast)
        } catch (err) {
            console.error(`Error updating booking ${bookingId} to ${newStatus}:`, err);
            setError(err.response?.data?.message || `Failed to update booking status.`);
            // Consider adding an error notification
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to permanently delete this booking?")) {
            return;
        }
        try {
            // Uses the existing DELETE /api/booking endpoint
            // Axios DELETE requests send payload in a 'data' object
            await axios.delete('/api/booking', { data: { bookingId } });
            setBookings(prevBookings => prevBookings.filter(b => b._id !== bookingId));
            // Consider adding a success notification
        } catch (err) {
            console.error(`Error deleting booking ${bookingId}:`, err);
            setError(err.response?.data?.message || `Failed to delete booking.`);
            // Consider adding an error notification
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-800 text-white flex justify-center items-center">
                <p className="text-xl animate-pulse">Loading Admin Dashboard...</p>
            </div>
        );
    }

    // This condition handles cases where user is not logged in, or not an admin,
    // or an error occurred during the auth check or initial data fetch for an admin.
    if (error) {
        return (
            <div className="min-h-screen bg-gray-800 text-white flex flex-col justify-center items-center p-4">
                <p className="text-xl text-red-400 text-center">{error}</p>
                {user?.role === 'admin' && ( // Show retry only if it was an admin trying to load data
                    <button
                        onClick={fetchAllBookings}
                        className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
                    >
                        Retry Fetching Bookings
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen font-inter bg-gray-100 text-gray-800 p-4 md:p-8">
            <div className="container mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-700">
                        Admin - Manage Bookings
                    </h1>
                </header>

                {bookings.length > 0 ? (
                    <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <tr>
                                    {/* <th className="py-3 px-6 text-left">Booking ID</th> */}
                                    <th className="py-3 px-6 text-left">Car</th>
                                    <th className="py-3 px-6 text-left">Pickup</th>
                                    <th className="py-3 px-6 text-left">Dropoff</th>
                                    <th className="py-3 px-6 text-center">Fare</th>
                                    <th className="py-3 px-6 text-center">Booking Status</th>
                                    <th className="py-3 px-6 text-center">Payment Status</th>
                                    <th className="py-3 px-6 text-center">Booked On</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm font-light">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                                        {/* <td className="py-3 px-6 text-left whitespace-nowrap"><span className="font-medium">{booking._id}</span></td> */}
                                        <td className="py-3 px-6 text-left"><span>{booking.carName}</span></td>
                                        <td className="py-3 px-6 text-left">
                                            <div>{booking.pickupAddress}</div>
                                            <div className="text-xs text-gray-500">{new Date(booking.pickupDate).toLocaleString()}</div>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <div>{booking.dropoffAddress}</div>
                                            <div className="text-xs text-gray-500">{new Date(booking.dropoffDate).toLocaleString()}</div>
                                        </td>
                                        <td className="py-3 px-6 text-center"><span>${booking.totalFare.toFixed(2)}</span></td>
                                        <td className="py-3 px-6 text-center">
                                            <span className={`py-1 px-3 rounded-full text-xs font-semibold ${booking.status === BOOKING_STATUSES.CONFIRMED ? 'bg-green-100 text-green-700' :
                                                booking.status === BOOKING_STATUSES.COMPLETED ? 'bg-blue-100 text-blue-700' :
                                                    booking.status === BOOKING_STATUSES.PENDING ? 'bg-yellow-100 text-yellow-700' :
                                                        booking.status === BOOKING_STATUSES.CANCELLED ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <span className={`py-1 px-3 rounded-full text-xs font-semibold ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                    booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700' // Default for undefined or other statuses
                                                }`}>
                                                {booking.paymentStatus ? booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-center"><span>{new Date(booking.createdAt).toLocaleDateString()}</span></td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex item-center justify-center space-x-1 md:space-x-2">
                                                {booking.status === BOOKING_STATUSES.PENDING && (
                                                    <button onClick={() => handleUpdateStatus(booking._id, BOOKING_STATUSES.CONFIRMED)} className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline transition-colors">Confirm</button>
                                                )}
                                                {booking.status !== BOOKING_STATUSES.COMPLETED && booking.status !== BOOKING_STATUSES.CANCELLED && (
                                                    <button onClick={() => handleUpdateStatus(booking._id, BOOKING_STATUSES.CANCELLED)} className="text-xs bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline transition-colors">Cancel</button>
                                                )}
                                                <button onClick={() => handleDeleteBooking(booking._id)} className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline transition-colors">Delete</button>
                                                {/* TODO: Add an "Update" button that could open a modal for more complex edits if needed */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-lg">No bookings found to manage.</p>
                )}
            </div>
        </div>
    );
}
