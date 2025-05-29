'use client';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

// Main App component that renders the BookingPage
export default function App() {
    return (
        <div className="min-h-screen  text-red-600 font-inter">
            <BookingPage />
        </div>
    );
}

function BookingPage() {
    // State for form fields
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [dropoffDate, setDropoffDate] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [message, setMessage] = useState(''); // State for displaying messages
    const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
    const [selectedCar, setSelectedCar] = useState(null); // State for selected car object
    const [mapUrl, setMapUrl] = useState(''); // State for the map URL
    const [isLoadingMap, setIsLoadingMap] = useState(false); // State for map loading status
    const [originLatLon, setOriginLatLon] = useState({ lat: null, lon: null }); // State for origin coordinates
    const [destinationLatLon, setDestinationLatLon] = useState({ lat: null, lon: null }); // State for destination coordinates
    const [totalDates, setTotalDates] = useState(0);
    const { user, logout, loading } = useAuth();
    const [totalFare, setTotalFare] = useState(0);

    // Create a ref for the booking form section
    const bookingFormRef = useRef(null);

    const cars = [
        { id: '1', name: 'Sapphire Convertible', type: 'luxury', imageUrl: '/Breeze.jpg' },
        { id: '2', name: 'Harrier Wagon', type: 'suv', imageUrl: '/Harrier.jpg' },
        { id: '3', name: 'Eclipse Sedan', type: 'sedan', imageUrl: '/Eclipse.jpg' },
        { id: '4', name: 'Compact Hatchback', type: 'compact', imageUrl: '/Porshee.jpg' },
        { id: '5', name: 'Family Van', type: 'van', imageUrl: '/van.jpg' },
        { id: '6', name: 'Electric Sport', type: 'luxury', imageUrl: '/Voyager.png' },
    ];

    useEffect(() => {
        if (pickupDate && dropoffDate) {
            const pDate = new Date(pickupDate);
            const dDate = new Date(dropoffDate);
            if (dDate >= pDate) {
                const diffTime = dDate.getTime() - pDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setTotalDates(diffDays);
                if (messageType !== 'error') { // Don't overwrite error messages
                    setMessage(diffDays >= 0 ? `Total rental days: ${diffDays}` : '');
                    if (diffDays >= 0) setMessageType('success');
                }
            } else {
                setTotalDates(0);
                setMessage('Drop-off date cannot be earlier than pickup date.');
                setMessageType('error');
            }
        } else {
            setTotalDates(0);
        }
    }, [pickupDate, dropoffDate, messageType]);

    useEffect(() => {
        if (selectedCar && totalDates >= 0) {
            const dailyRate = selectedCar.type === 'luxury' ? 100 :
                selectedCar.type === 'suv' ? 80 :
                    selectedCar.type === 'sedan' ? 50 :
                        selectedCar.type === 'compact' ? 40 : 20;
            setTotalFare(totalDates * dailyRate);
        } else {
            setTotalFare(0);
        }
    }, [selectedCar, totalDates]);

    // Function to generate OpenStreetMap embed URL with markers after geocoding
    const generateEmbedMapUrlWithMarkers = async (originName, destinationName) => {
        if (!originName || !destinationName) {
            console.warn('Origin or destination is missing for map URL generation.');
            setMessage('Origin or destination is missing.');
            setMessageType('error');
            return '';
        }

        const localGeocodeUrl = (locationName) => `/api/book-rental?locationName=${encodeURIComponent(locationName)}`;

        try {
            const [originRes, destinationRes] = await Promise.all([
                axios.get(localGeocodeUrl(originName)),
                axios.get(localGeocodeUrl(destinationName))
            ]);

            const originData = originRes.data;
            const destinationData = destinationRes.data;

            if (!originData || originData.length === 0 || !originData[0] || !originData[0].lat || !originData[0].lon) {
                console.error('Could not geocode origin or data is invalid:', originName, originData);
                setMessage(`Could not find valid coordinates for origin: ${originName}. Please try a more specific address or check server logs for API errors.`);
                setMessageType('error');
                return '';
            }
            if (!destinationData || destinationData.length === 0 || !destinationData[0] || !destinationData[0].lat || !destinationData[0].lon) {
                console.error('Could not geocode destination or data is invalid:', destinationName, destinationData);
                setMessage(`Could not find valid coordinates for destination: ${destinationName}. Please try a more specific address or check server logs for API errors.`);
                setMessageType('error');
                return '';
            }
            console.log(`Origin Data:`, originData);
            console.log(`Destination Data:`, destinationData);

            const originLat = originData[0].lat;
            const originLon = originData[0].lon;
            const destLat = destinationData[0].lat;
            const destLon = destinationData[0].lon;

            // Convert to numbers and check for NaN
            const numOriginLat = parseFloat(originLat);
            const numOriginLon = parseFloat(originLon);
            const numDestLat = parseFloat(destLat);
            const numDestLon = parseFloat(destLon);

            if (isNaN(numOriginLat) || isNaN(numOriginLon) || isNaN(numDestLat) || isNaN(numDestLon)) {
                console.error('Parsed coordinates are NaN:', { originName, originLat, originLon, destinationName, destLat, destLon });
                setMessage('Failed to parse coordinates for the locations. Please check the addresses and try again.');
                setMessageType('error');
                return '';
            }
            setOriginLatLon({ lat: numOriginLat, lon: numOriginLon }); // Update origin coordinates state with numbers
            setDestinationLatLon({ lat: numDestLat, lon: numDestLon }); // Update destination coordinates state with numbers

            // Construct the Google Maps embed URL for directions using latitude and longitude.
            // This format does not require an API key.
            const embedUrl = `https://maps.google.com/maps?saddr=${numOriginLat},${numOriginLon}&daddr=${numDestLat},${numDestLon}&output=embed`;

            console.log(`Generated Embed Map URL: ${embedUrl}`);
            return embedUrl;

        } catch (error) {
            console.error('Error geocoding or generating map URL:', error);
            setMessage('Error finding locations or generating map. Please check the locations or try again.');
            setMessageType('error');
            return '';
        }
    };

    // Handle car selection from image click
    const handleCarSelect = (car) => {
        setSelectedCar(car);
        setVehicleType(car.type); // Update form's vehicle type based on selected car

        // Scroll to the booking form section
        if (bookingFormRef.current) {
            bookingFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Handle vehicle type selection from dropdown
    const handleVehicleTypeChange = (e) => {
        const newVehicleType = e.target.value;
        setVehicleType(newVehicleType);

        // Find a car that matches the selected vehicle type
        const matchingCar = cars.find(car => car.type === newVehicleType);
        setSelectedCar(matchingCar || null); // Set selectedCar to the matching car or null if no match


        // Scroll to the booking form section if a type is selected
        if (newVehicleType && bookingFormRef.current) {
            bookingFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('success');

        if (!user) {
            setMessage('You must be logged in to make a booking.');
            setMessageType('error');
            return;
        }

        if (!selectedCar) {
            setMessage('Please select a car model from the fleet.');
            setMessageType('error');
            return;
        }
        if (!pickupLocation.trim() || !dropoffLocation.trim()) {
            setMessage('Pickup and Drop-off location names cannot be empty.');
            setMessageType('error');
            return;
        }


        if (!pickupDate || !dropoffDate) {
            setMessage('Please select pickup and drop-off dates.');
            setMessageType('error');
            return;
        }
        if (new Date(dropoffDate) < new Date(pickupDate)) {
            setMessage('Drop-off date cannot be earlier than pickup date.');
            setMessageType('error');
            return;
        }

        if (
            typeof originLatLon.lat !== 'number' || originLatLon.lat === null ||
            typeof originLatLon.lon !== 'number' || originLatLon.lon === null ||
            typeof destinationLatLon.lat !== 'number' || destinationLatLon.lat === null ||
            typeof destinationLatLon.lon !== 'number' || destinationLatLon.lon === null
        ) {
            setMessage('Pickup and Drop-off locations must be successfully geocoded to get valid numeric coordinates. Please use "Show Directions on Map" and ensure locations are found.');
            setMessageType('error');
            return;
        }

        // Ensure totalDates and totalFare are based on the latest state
        // The useEffects for totalDates and totalFare should have updated them
        if (totalDates < 0) { // Should not happen if date validation is correct
            setMessage('Invalid date range resulting in negative total days.');
            setMessageType('error');
            return;
        }

        const bookingData = {
            userId: user._id,
            carName: selectedCar.name,
            carType: selectedCar.type,
            pickupAddress: pickupLocation, // String address
            dropoffAddress: dropoffLocation, // String address
            pickupCoordinates: [originLatLon.lon, originLatLon.lat], // [lng, lat]
            dropoffCoordinates: [destinationLatLon.lon, destinationLatLon.lat], // [lng, lat]
            pickupDate,
            dropoffDate,
            totalDates,
            totalFare,
        };

        console.log('Submitting booking data:', bookingData);

        try {
            const response = await axios.post('/api/booking', bookingData);
            setMessage(response.data.message || 'Your booking request has been submitted successfully!');
            setMessageType('success');
            // Optionally clear the form
            setPickupLocation('');
            setDropoffLocation('');
            setPickupDate('');
            setDropoffDate('');
            setVehicleType('');
            setSelectedCar(null);
            setTotalDates(0);
            setOriginLatLon({ lat: null, lon: null });
            setDestinationLatLon({ lat: null, lon: null });
            setTotalFare(0);

            setMapUrl(''); // Clear map after submission
        } catch (err) {
            setMessage(err.response?.data?.message || 'An error occurred while submitting your booking.');
            setMessageType('error');
        }
    };

    // Handle showing directions on map
    const handleShowDirections = async () => {
        if (pickupLocation && dropoffLocation) {
            setIsLoadingMap(true);
            setMapUrl(''); // Clear previous map
            setMessage(''); // Clear previous messages, generateEmbedMapUrlWithMarkers will set new ones on error
            const url = await generateEmbedMapUrlWithMarkers(pickupLocation, dropoffLocation);
            if (url) {
                setMapUrl(url);
            } // If url is empty, generateEmbedMapUrlWithMarkers should have set an appropriate error message.
            setIsLoadingMap(false);
        } else {
            setMessage('Please enter both Pickup and Drop-off Locations to show directions.');
            setMessageType('error');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            {/* Header Section */}
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-500 mb-4">
                    Book Your Rental
                </h1>
                <p className="text-lg text-black max-w-2xl mx-auto">
                    Experience seamless car rental with DriverLy. Select your preferred vehicle and fill out the form below.
                </p>
            </header>

            {/* Car Selection Section */}
            <section className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6 text-center">Our Fleet</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <div
                            key={car.id}
                            className={` rounded-xl shadow-lg overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 border-2 ${selectedCar && selectedCar.id === car.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-700'
                                }`}
                            onClick={() => handleCarSelect(car)}
                        >
                            <Image
                                src={car.imageUrl}
                                alt={car.name}
                                width={400}
                                height={192}
                                className="w-full h-48 object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/1e293b/cbd5e1?text=Image+Error"; }}
                                unoptimized
                            />
                            <div className="p-4 text-center">
                                <h3 className="text-xl font-semibold text-red-600">{car.name}</h3>
                                <p className="text-gray-400 text-sm">{car.type.charAt(0).toUpperCase() + car.type.slice(1)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Booking Form Section */}
            <div ref={bookingFormRef} className=" p-6 md:p-10 rounded-xl shadow-lg max-w-3xl mx-auto border border-gray-700">
                {message && (
                    <div // Adjusted message styling for better contrast
                        className={`p-3 rounded-md mb-6 text-center ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pickup Location */}
                    <div>
                        <label htmlFor="pickupLocation" className="block text-black text-sm font-bold mb-2">
                            Pickup Location
                        </label>
                        <input
                            type="text"
                            id="pickupLocation"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4  text-red-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="e.g., Airport Terminal 1"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            required
                        />
                    </div>

                    {/* Drop-off Location */}
                    <div>
                        <label htmlFor="dropoffLocation" className="block text-black text-sm font-bold mb-2">
                            Drop-off Location
                        </label>
                        <input
                            type="text"
                            id="dropoffLocation"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4  text-red-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="e.g., Downtown Hotel"
                            value={dropoffLocation}
                            onChange={(e) => setDropoffLocation(e.target.value)}
                            required
                        />
                    </div>

                    {/* Pickup Date */}
                    <div>
                        <label htmlFor="pickupDate" className="block text-black text-sm font-bold mb-2">
                            Pickup Date
                        </label>
                        <input
                            type="date"
                            id="pickupDate"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4  text-red-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Drop-off Date */}
                    <div>
                        <label htmlFor="dropoffDate" className="block text-black text-sm font-bold mb-2">
                            Drop-off Date
                        </label>
                        <input
                            type="date"
                            id="dropoffDate"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4  text-red-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={dropoffDate}
                            onChange={(e) => setDropoffDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Vehicle Type - now updated by car selection and updates car selection */}
                    <div className="md:col-span-2">
                        <label htmlFor="vehicleType" className="block text-black text-sm font-bold mb-2">
                            Preferred Vehicle Type
                        </label>
                        <select
                            id="vehicleType"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4  text-red-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={vehicleType}
                            onChange={handleVehicleTypeChange}
                            required
                        >
                            <option value="">Select a vehicle type</option>
                            {/* Populate options dynamically from car data or keep static */}
                            <option value="compact">Compact Car</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="luxury">Luxury Car</option>
                            <option value="van">Van</option>
                        </select>

                        <label htmlFor="dropoffDate" className="block mt-2 text-black text-sm font-bold mb-2">
                            Price
                        </label>
                        <input
                            type="text"
                            id="dropoffDate"
                            readOnly
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4  text-red-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={selectedCar ? `$${selectedCar.type === 'luxury' ? '100' : selectedCar.type === 'suv' ? '80' : selectedCar.type === 'sedan' ? '50' : selectedCar.type === 'compact' ? '40' : '20'}` : 'Select a car to see price'}
                        />

                        <label htmlFor="dropoffDate" className="block mt-2 text-black text-sm font-bold mb-2">
                            Total Fare
                        </label>                        <p className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4  text-red-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                            {
                                totalDates > 0 ? `$${totalFare}` : 'Select a car and enter dates to see total fare'
                            }

                        </p>

                    </div>

                    {/* Currently Selected Car Display */}
                    {selectedCar && (
                        <div className="md:col-span-2 mt-4 p-4  rounded-lg border border-blue-500 text-center">
                            <p className="text-lg font-semibold text-blue-400">Selected Car:</p>
                            <p className="text-xl font-bold">{selectedCar.name}</p>
                            <p className="text-gray-400 text-sm">({selectedCar.type.charAt(0).toUpperCase() + selectedCar.type.slice(1)})</p>
                            <Image
                                src={selectedCar.imageUrl}
                                alt={selectedCar.name}
                                width={400}
                                height={250}
                                className="mt-4 rounded-lg shadow-md mx-auto"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/1e293b/cbd5e1?text=Image+Error"; }}
                            />
                        </div>
                    )}

                    {/* Show Directions Button */}
                    <div className="md:col-span-2 text-center mt-4">
                        <button
                            type="button" // Important: set type to "button" to prevent form submission
                            onClick={handleShowDirections}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            Show Directions on Map
                        </button>
                    </div>

                    {/* Map Display */}
                    {isLoadingMap && (
                        <div className="md:col-span-2 mt-8 text-center">
                            <p className="text-lg text-black">Loading map...</p>
                        </div>
                    )}
                    {mapUrl && !isLoadingMap && (
                        <div className="md:col-span-2 mt-8">
                            <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">Route Overview</h2>
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
                                <iframe
                                    title="Directions Map"
                                    className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-700"
                                    src={mapUrl}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="md:col-span-2 text-center mt-4">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            Book Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
