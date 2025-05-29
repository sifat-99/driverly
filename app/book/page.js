'use client';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';

// Main App component that renders the BookingPage
export default function App() {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-inter">
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

    // Create a ref for the booking form section
    const bookingFormRef = useRef(null);

    // Sample car data (replace with your actual car data)
    const cars = [
        { id: '1', name: 'Sapphire Convertible', type: 'luxury', imageUrl: 'https://placehold.co/400x250/1e293b/cbd5e1?text=Convertible' },
        { id: '2', name: 'Harrier Wagon', type: 'suv', imageUrl: 'https://placehold.co/400x250/1e293b/cbd5e1?text=SUV' },
        { id: '3', name: 'Eclipse Sedan', type: 'sedan', imageUrl: 'https://placehold.co/400x250/1e293b/cbd5e1?text=Sedan' },
        { id: '4', name: 'Compact Hatchback', type: 'compact', imageUrl: 'https://placehold.co/400x250/1e293b/cbd5e1?text=Compact' },
        { id: '5', name: 'Family Van', type: 'van', imageUrl: 'https://placehold.co/400x250/1e293b/cbd5e1?text=Van' },
        { id: '6', name: 'Electric Sport', type: 'luxury', imageUrl: 'https://placehold.co/400x250/1e293b/cbd5e1?text=Electric' },
    ];

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

            if (isNaN(originLat) || isNaN(originLon) || isNaN(destLat) || isNaN(destLon)) {
                console.error('Parsed coordinates are NaN:', { originName, originLat, originLon, destinationName, destLat, destLon });
                setMessage('Failed to parse coordinates for the locations. Please check the addresses and try again.');
                setMessageType('error');
                return '';
            }



            const originCoords = { lat: originLat, lon: originLon };
            const destinationCoords = { lat: destLat, lon: destLon };

            setOriginLatLon(originCoords); // Update origin coordinates state
            setDestinationLatLon(destinationCoords); // Update destination coordinates state

            // Construct the Google Maps embed URL for directions using latitude and longitude.
            // This format does not require an API key.
            const embedUrl = `https://maps.google.com/maps?saddr=${originCoords.lat},${originCoords.lon}&daddr=${destinationCoords.lat},${destinationCoords.lon}&output=embed`;

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
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this data to a backend server
        // For this example, we'll just log it and show a success message.
        console.log({
            pickupLocation,
            dropoffLocation,
            pickupDate,
            dropoffDate,
            vehicleType: selectedCar ? selectedCar.name : vehicleType, // Use selected car name if available
        });
        setMessage('Your booking request has been submitted successfully!');
        setMessageType('success');
        // Optionally clear the form
        setPickupLocation('');
        setDropoffLocation('');
        setPickupDate('');
        setDropoffDate('');
        setVehicleType('');
        setSelectedCar(null);
        setMapUrl(''); // Clear map after submission
    };

    // Handle showing directions on map
    const handleShowDirections = async () => {
        if (pickupLocation && dropoffLocation) {
            setIsLoadingMap(true);
            setMapUrl(''); // Clear previous map
            setMessage(''); // Clear previous messages
            // setMessageType will be handled by generateEmbedMapUrlWithMarkers or below

            const url = await generateEmbedMapUrlWithMarkers(pickupLocation, dropoffLocation);

            if (url) {
                setMapUrl(url);
            } else {
                // Message should be set by generateEmbedMapUrlWithMarkers on failure
                // If not, set a generic one (though it should be covered)
                if (!message) { // Check if message state is still empty
                    setMessage('Could not generate map for the given locations. Please check inputs and console logs.');
                    setMessageType('error');
                }
            }
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
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
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
                            className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 border-2 ${selectedCar && selectedCar.id === car.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-700'
                                }`}
                            onClick={() => handleCarSelect(car)}
                        >
                            <img
                                src={car.imageUrl}
                                alt={car.name}
                                className="w-full h-48 object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/1e293b/cbd5e1?text=Image+Error"; }}
                            />
                            <div className="p-4 text-center">
                                <h3 className="text-xl font-semibold text-white">{car.name}</h3>
                                <p className="text-gray-400 text-sm">{car.type.charAt(0).toUpperCase() + car.type.slice(1)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Booking Form Section */}
            <div ref={bookingFormRef} className="bg-gray-800 p-6 md:p-10 rounded-xl shadow-lg max-w-3xl mx-auto border border-gray-700">
                {message && (
                    <div
                        className={`text-white p-3 rounded-md mb-6 text-center ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    >
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pickup Location */}
                    <div>
                        <label htmlFor="pickupLocation" className="block text-gray-300 text-sm font-bold mb-2">
                            Pickup Location
                        </label>
                        <input
                            type="text"
                            id="pickupLocation"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="e.g., Airport Terminal 1"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            required
                        />
                    </div>

                    {/* Drop-off Location */}
                    <div>
                        <label htmlFor="dropoffLocation" className="block text-gray-300 text-sm font-bold mb-2">
                            Drop-off Location
                        </label>
                        <input
                            type="text"
                            id="dropoffLocation"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="e.g., Downtown Hotel"
                            value={dropoffLocation}
                            onChange={(e) => setDropoffLocation(e.target.value)}
                            required
                        />
                    </div>

                    {/* Pickup Date */}
                    <div>
                        <label htmlFor="pickupDate" className="block text-gray-300 text-sm font-bold mb-2">
                            Pickup Date
                        </label>
                        <input
                            type="date"
                            id="pickupDate"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Drop-off Date */}
                    <div>
                        <label htmlFor="dropoffDate" className="block text-gray-300 text-sm font-bold mb-2">
                            Drop-off Date
                        </label>
                        <input
                            type="date"
                            id="dropoffDate"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={dropoffDate}
                            onChange={(e) => setDropoffDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Vehicle Type - now updated by car selection and updates car selection */}
                    <div className="md:col-span-2">
                        <label htmlFor="vehicleType" className="block text-gray-300 text-sm font-bold mb-2">
                            Preferred Vehicle Type
                        </label>
                        <select
                            id="vehicleType"
                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                    </div>

                    {/* Currently Selected Car Display */}
                    {selectedCar && (
                        <div className="md:col-span-2 mt-4 p-4 bg-gray-700 rounded-lg border border-blue-500 text-center">
                            <p className="text-lg font-semibold text-blue-400">Selected Car:</p>
                            <p className="text-xl font-bold">{selectedCar.name}</p>
                            <p className="text-gray-400 text-sm">({selectedCar.type.charAt(0).toUpperCase() + selectedCar.type.slice(1)})</p>
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
                            <p className="text-lg text-gray-300">Loading map...</p>
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
