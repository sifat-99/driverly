import { NextResponse } from 'next/server';
import { getDb } from '@/utils/db'; // Use getDb for MongoDB connection
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb'; // Import ObjectId
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Input validation
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required.' },
                { status: 400 }
            );
        }

        const db = await getDb(); // Get database instance
        const usersCollection = db.collection('users'); // Get the users collection

        // Find the user by email
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid email or password.' },
                { status: 401 }
            );
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid email or password.' },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id.toString(), // Convert ObjectId to string
                email: user.email,
                name: user.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        // Set HTTP-only cookie
        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json(
            {
                message: 'Login successful!',
                user: {
                    name: user.name,
                    email: user.email,
                    _id: user._id.toString(), // Include user ID as string
                    username: user.username,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('[Login API Error]', error);
        return NextResponse.json(
            {
                message: 'An error occurred during login.',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
