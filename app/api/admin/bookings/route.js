import { NextResponse } from 'next/server';
// import { ObjectId } from 'mongodb'; // Not strictly needed for GET all, but useful if filtering by other ObjectIds
import { getDb } from '@/utils/db';
// import { verifyAdminRole } from '@/utils/authAdmin'; // IMPORTANT: Implement actual admin verification

export async function GET(request) {
    // **IMPORTANT SECURITY NOTE:**
    // In a real application, you MUST verify that the user making this request is an admin.
    // This typically involves checking a JWT token, session, or other authentication mechanism.
    // const isAdmin = await verifyAdminRole(request); // Example:
    // if (!isAdmin) {
    //     return NextResponse.json({ message: 'Unauthorized: Admin role required.' }, { status: 403 });
    // }

    try {
        const db = await getDb();
        const bookingsCollection = db.collection('bookings');

        // Fetch all bookings. You might want to sort them, e.g., by creation date or pickup date.
        // Consider adding pagination for large datasets.
        const bookings = await bookingsCollection.find({}).sort({ createdAt: -1 }).toArray();

        // Optional: If you need user details (like name/email) instead of just user ID in the admin view,
        // you would use MongoDB's aggregation framework with $lookup here to join with the users collection.

        return NextResponse.json({ bookings }, { status: 200 });

    } catch (error) {
        console.error('Error fetching all bookings for admin:', error);
        return NextResponse.json({ message: 'Internal server error while fetching bookings for admin.', error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    // **IMPORTANT SECURITY NOTE:**
    // In a real application, you MUST verify that the user making this request is an admin.
    // This typically involves checking a JWT token, session, or other authentication mechanism.
    // const isAdmin = await verifyAdminRole(request); // Example:
    // if (!isAdmin) {
    //     return NextResponse.json({ message: 'Unauthorized: Admin role required.' }, { status: 403 });
    // }

    try {
        const db = await getDb();
        const bookingsCollection = db.collection('bookings');

        const { bookingId } = await request.json();

        if (!bookingId) {
            return NextResponse.json({ message: 'Booking ID is required.' }, { status: 400 });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(bookingId)) {
            return NextResponse.json({ message: 'Invalid booking ID format.' }, { status: 400 });
        }

        const result = await bookingsCollection.deleteOne({ _id: new ObjectId(bookingId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Booking not found or already deleted.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Booking deleted successfully.' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting booking:', error);
        return NextResponse.json({ message: 'Internal server error while deleting booking.', error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    // **IMPORTANT SECURITY NOTE:**
    // In a real application, you MUST verify that the user making this request is an admin.
    // This typically involves checking a JWT token, session, or other authentication mechanism.
    // const isAdmin = await verifyAdminRole(request); // Example:
    // if (!isAdmin) {
    //     return NextResponse.json({ message: 'Unauthorized: Admin role required.' }, { status: 403 });
    // }

    try {
        const db = await getDb();
        const bookingsCollection = db.collection('bookings');

        const data = await request.json();

        const { bookingId, status } = data;

        if (!bookingId || !status) {
            return NextResponse.json({ message: 'Booking ID and status are required.' }, { status: 400 });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(bookingId)) {
            return NextResponse.json({ message: 'Invalid booking ID format.' }, { status: 400 });
        }

        const result = await bookingsCollection.updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { status, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Booking updated successfully.' }, { status: 200 });

    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ message: 'Internal server error while updating booking.', error: error.message }, { status: 500 });
    }
}
