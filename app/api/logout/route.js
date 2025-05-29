import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Clear the token cookie
        cookies().set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0), // Set to a past date to expire immediately
            path: '/',
        });
        return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'Internal server error during logout' }, { status: 500 });
    }
}
