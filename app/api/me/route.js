import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDb } from '@/utils/db'; // Use getDb for MongoDB connection
import { ObjectId } from 'mongodb'; // Import ObjectId

export async function GET(request) {
    try {
        const tokenCookie = cookies().get('token');

        if (!tokenCookie || !tokenCookie.value) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const token = tokenCookie.value;
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
        }

        const db = await getDb(); // Get database instance
        const usersCollection = db.collection('users'); // Get the users collection
        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) }, { projection: { password: 0 } }); // Find user by ObjectId and exclude password

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error('Me API error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
