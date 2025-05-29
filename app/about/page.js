'use client';

import React from 'react';

export default function AboutPage() {
    return (
        <div className="min-h-screen font-inter text-black">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-500 mb-4">
                        About DriverLy
                    </h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                        Your trusted partner for seamless and reliable car rentals.
                    </p>
                </header>

                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Our Mission</h2>
                    <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto text-center">
                        At DriverLy, our mission is to provide an exceptional car rental experience by offering a diverse fleet of high-quality vehicles,
                        transparent pricing, and outstanding customer service. We aim to make your journey smooth, enjoyable, and hassle-free,
                        whether you&apos;re traveling for business or leisure.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Our Story</h2>
                    <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto text-center">
                        Founded with a passion for travel and a commitment to convenience, DriverLy started as a small venture with a handful of cars.
                        Through dedication and a customer-first approach, we have grown into a reputable car rental service known for reliability and excellence.
                        We continuously strive to innovate and improve our services to meet the evolving needs of our valued customers.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className=" p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold text-blue-500 mb-2">Wide Selection</h3>
                            <p className="text-gray-600">From compact cars for city trips to luxury sedans and spacious SUVs for family adventures, we have the perfect vehicle for every need.</p>
                        </div>
                        <div className=" p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold text-blue-500 mb-2">Transparent Pricing</h3>
                            <p className="text-gray-600">No hidden fees. We believe in clear and upfront pricing, so you know exactly what you&apos;re paying for.</p>
                        </div>
                        <div className=" p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold text-blue-500 mb-2">Customer Focused</h3>
                            <p className="text-gray-600">Our dedicated team is here to assist you at every step, ensuring a smooth rental process from booking to drop-off.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
