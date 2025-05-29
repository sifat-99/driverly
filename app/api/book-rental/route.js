import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const locationName = searchParams.get('locationName');

    if (!locationName) {
        return NextResponse.json({ message: 'Location name is required' }, { status: 400 });
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1&addressdetails=1`;

    try {
        const response = await fetch(nominatimUrl, {
            method: 'GET',
            headers: {
                // IMPORTANT: Set a descriptive User-Agent.
                // Replace 'DriverLyApp/1.0 (contact@example.com)' with your actual app name and contact.
                // Nominatim's usage policy requires a valid User-Agent.
                'User-Agent': 'DriverLyApp/1.0 (contact@example.com)',
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Nominatim API error: ${response.status}`, errorData);
            return NextResponse.json({ message: `Error fetching data from Nominatim: ${response.statusText}`, details: errorData }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error proxying geocoding request:', error);
        return NextResponse.json({ message: 'Internal server error while geocoding.', error: error.message }, { status: 500 });
    }
}
