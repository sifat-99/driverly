'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSidebar() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <aside className="w-64 bg-gray-800 text-white p-4 min-h-screen">
                <p>Loading user...</p>
            </aside>
        );
    }

    return (
        <aside className="w-64 bg-gray-800 text-white p-4 min-h-screen flex flex-col">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-blue-400">Dashboard</h2>
                {user && (
                    <p className="text-sm text-gray-400 mt-1">Welcome, {user.name}!</p>
                )}
            </div>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    <li>
                        {/* Link to the User Profile section on the same page */}
                        <Link href="/dashboard/profile" className="block py-2 px-3 rounded hover:bg-gray-700 transition-colors">
                            Profile
                        </Link>
                    </li>
                    <li>
                        {/* Link to the Booking History section on the same page */}
                        <Link href="/booking-history" className="block py-2 px-3 rounded hover:bg-gray-700 transition-colors">
                            Booking History
                        </Link>
                    </li>
                    {/* Add more navigation links here if needed */}
                </ul>
            </nav>
        </aside>
    );
}
