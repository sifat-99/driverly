import { NextResponse } from 'next/server';

export async function GET(request) {
    // In a real app, you'd fetch this based on an authenticated user
    const mockUserData = {
        name: 'Sifat Hossain',
        email: 'sifat@example.com',
        memberSince: '2023-01-15',
    };

    const mockBookingData = [
        {
            id: 'booking123',
            carName: 'Sapphire Convertible',
            pickupLocation: 'Airport Terminal 1',
            dropoffLocation: 'Downtown Hotel',
            pickupDate: '2024-08-15',
            dropoffDate: '2024-08-18',
            status: 'Confirmed',
            price: '$350.00'
        },
        {
            id: 'booking456',
            carName: 'Harrier Wagon',
            pickupLocation: 'City Center Mall',
            dropoffLocation: 'Mountain View Resort',
            pickupDate: '2024-09-01',
            dropoffDate: '2024-09-05',
            status: 'Completed',
            price: '$420.00'
        },
    ];

    return NextResponse.json({
        user: mockUserData,
        bookings: mockBookingData,
    });
}
