import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/utils/db'; // Use getDb for MongoDB connection
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { name, email, password, confirmPassword } = await request.json();

        console.log('[Register API] Received:', {
            name,
            email,
            password_provided: !!password,
            confirmPassword_provided: !!confirmPassword,
        });

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            return NextResponse.json(
                { message: 'All fields are required.' },
                { status: 400 }
            );
        }

        if (typeof email !== 'string' || email.trim() === '') {
            return NextResponse.json(
                { message: 'A valid email is required.' },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { message: 'Passwords do not match.' },
                { status: 400 }
            );
        }

        const db = await getDb(); // Get database instance
        const usersCollection = db.collection('users'); // Get the users collection

        // Generate a username from the email
        const username = email.split('@')[0];

        // Check for existing user (by email or username)
        const existingUser = await usersCollection.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email or username already exists.' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUserDocument = {
            username,
            name,
            email,
            password: hashedPassword,
            memberSince: new Date(), // Add memberSince field
            role: 'user', // Default role for new users
        };

        const result = await usersCollection.insertOne(newUserDocument);
        if (!result.insertedId) {
            console.error('[Register API Error] Failed to insert user into database.');
            return NextResponse.json({ message: 'User registration failed, please try again.' }, { status: 500 });
        }

        // Construct the newUser object with the insertedId for JWT and response
        const newUser = { ...newUserDocument, _id: result.insertedId };

        // Generate JWT
        const token = jwt.sign(
            {
                userId: newUser._id.toString(), // Convert ObjectId to string
                email: newUser.email,
                name: newUser.name,
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
                message: 'User registered successfully!',
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    username: newUser.username,
                    _id: newUser._id.toString(), // Include user ID as string
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('[Register API Error]', error);
        return NextResponse.json(
            {
                message: 'An error occurred during registration.',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
