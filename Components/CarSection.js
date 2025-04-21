/* eslint-disable @next/next/no-img-element */
'use client'
import { useState } from 'react';

const fleetData = [
    { name: "Sapphire Convertible", price: "$219", type: "Coupe", image: "/Porshee.jpg", numOfPassenger: 2, doors: 2 },
    { name: "Harrier Wagon", price: "$168", type: "SUV", image: "/Harrier.jpg", numOfPassenger: 6, doors: 4 },
    { name: "Eclipse Sedan", price: "$139", type: "Sedan", image: "/Eclipse.jpg", numOfPassenger: 4, doors: 2 },
    { name: "Breeze Compact", price: "$138", type: "Convertible", image: "/Breeze.jpg", numOfPassenger: 6, doors: 4 },
    { name: "Voyager GT", price: "$289", type: "Luxury", image: "/Voyager.png", numOfPassenger: 6, doors: 4 },
];

const itemsPerPage = 3;

export default function CarSection() {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(fleetData.length / itemsPerPage);

    const handleNext = () => setPage((prev) => (prev + 1) % totalPages);
    const handlePrev = () => setPage((prev) => (prev - 1 + totalPages) % totalPages);

    const currentItems = fleetData.slice(
        page * itemsPerPage,
        page * itemsPerPage + itemsPerPage
    );

    return (
        <section className="py-16 px-4">
            <div className="max-w-screen-xl mx-auto text-center text-black">
                <p className="text-red-500 font-semibold mb-2">★ Our Fleet</p>
                <h2 className="text-3xl font-bold mb-10 text-black">
                    Explore our perfect and extensive fleet
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                    {currentItems.map((car, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow text-left">
                            <img src={car.image} alt={car.name} className="w-full h-40 object-contain mb-4" />
                            <span className="text-sm text-gray-500">{car.type}</span>
                            <h3 className="font-bold">{car.name}</h3>
                            <div className="flex justify-between text-sm mt-2">
                                <span>🚪 4 Doors</span>
                                <span>👤 {car.numOfPassenger} Passengers</span>
                            </div>
                            <div className="mt-4 font-bold text-lg">{car.price} <span className="text-sm text-gray-500">/Day</span></div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-4">
                    <button onClick={handlePrev} className="w-10 h-10 bg-red-500 text-white rounded-full">←</button>
                    <button onClick={handleNext} className="w-10 h-10 bg-red-500 text-white rounded-full">→</button>
                </div>
            </div>
        </section>
    );
}
