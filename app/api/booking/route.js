import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb'; // Required for converting string IDs to ObjectId
import { getDb } from '@/utils/db';

export async function POST(request) {
    try {
        const db = await getDb();
        const bookingsCollection = db.collection('bookings');

        const data = await request.json();

        // Manually add createdAt and updatedAt timestamps
        const now = new Date();

        const {
            userId,
            carName,
            carType,
            pickupAddress,
            dropoffAddress,
            pickupCoordinates,
            dropoffCoordinates,
            pickupDate,
            dropoffDate,
            totalDates,
            totalFare,
        } = data;

        // Validate required fields
        if (
            !userId ||
            !carName ||
            !carType ||
            !pickupAddress ||
            !dropoffAddress ||
            !pickupCoordinates ||
            !dropoffCoordinates ||
            !pickupDate ||
            !dropoffDate ||
            totalDates === undefined || // Can be 0, so check for undefined
            totalFare === undefined   // Can be 0, so check for undefined
        ) {
            return NextResponse.json({ message: 'Missing required booking information.' }, { status: 400 });
        }

        // Validate coordinates format
        if (!Array.isArray(pickupCoordinates) || pickupCoordinates.length !== 2 ||
            typeof pickupCoordinates[0] !== 'number' || typeof pickupCoordinates[1] !== 'number' ||
            !Array.isArray(dropoffCoordinates) || dropoffCoordinates.length !== 2 ||
            typeof dropoffCoordinates[0] !== 'number' || typeof dropoffCoordinates[1] !== 'number') {
            return NextResponse.json({ message: 'Invalid coordinates format. Expected [longitude, latitude] for both pickup and dropoff.' }, { status: 400 });
        }

        // Construct the document to be inserted
        const bookingDocument = {
            user: new ObjectId(userId), // Convert string userId to MongoDB ObjectId
            carName,
            carType,
            pickupAddress,
            dropoffAddress,
            pickupLocation: {
                type: "Point",
                coordinates: [parseFloat(pickupCoordinates[0]), parseFloat(pickupCoordinates[1])]
            },
            dropoffLocation: {
                type: "Point",
                coordinates: [parseFloat(dropoffCoordinates[0]), parseFloat(dropoffCoordinates[1])]
            },
            pickupDate: new Date(pickupDate),
            dropoffDate: new Date(dropoffDate),
            totalDates,
            totalFare,
            status: 'pending',
            paymentStatus: 'pending',
            createdAt: now,
            updatedAt: now,
        };

        const result = await bookingsCollection.insertOne(bookingDocument);

        if (!result.insertedId) {
            return NextResponse.json({ message: 'Failed to create booking.' }, { status: 500 });
        }

        // Retrieve the inserted document to return it (optional, but common)
        const newBooking = await bookingsCollection.findOne({ _id: result.insertedId });

        return NextResponse.json({ message: 'Booking created successfully.', booking: newBooking }, { status: 201 });

    } catch (error) {
        console.error('Error creating booking:', error);
        // Handle potential ObjectId conversion errors or other specific MongoDB errors
        if (error.message.includes('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')) {
            return NextResponse.json({ message: 'Invalid userId format.' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error while creating booking.', error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const db = await getDb();
        const bookingsCollection = db.collection('bookings');

        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
        }
        // Validate ObjectId format
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json({ message: 'Invalid user ID format.' }, { status: 400 });
        }
        const bookings = await bookingsCollection.find({ user: new ObjectId(userId) }).toArray();

        if (bookings.length === 0) {
            return NextResponse.json({ message: 'No bookings found for this user.' }, { status: 404 });
        }
        return NextResponse.json({ bookings }, { status: 200 });


    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ message: 'Internal server error while fetching bookings.', error: error.message }, { status: 500 });
    }
}
export async function DELETE(request) {
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
    try {
        const db = await getDb();
        const bookingsCollection = db.collection('bookings');

        const data = await request.json();
        const { bookingId, ...updateFields } = data;

        if (!bookingId) {
            return NextResponse.json({ message: 'Booking ID is required.' }, { status: 400 });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(bookingId)) {
            return NextResponse.json({ message: 'Invalid booking ID format.' }, { status: 400 });
        }

        // Ensure there's something to update
        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: 'No update fields provided.' }, { status: 400 });
        }

        // Optional: Validate allowed fields to update
        const allowedUpdateFields = ['status', 'paymentStatus']; // Add other fields if needed
        for (const field in updateFields) {
            if (!allowedUpdateFields.includes(field)) {
                return NextResponse.json({ message: `Updating field '${field}' is not allowed.` }, { status: 400 });
            }
        }

        const result = await bookingsCollection.updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { ...updateFields, updatedAt: new Date() } }
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
