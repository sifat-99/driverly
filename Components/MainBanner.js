'use client'
import React from 'react'

function Banner() {
    return (
        <div
            className="relative flex flex-col items-center justify-center text-center py-24 px-6 bg-no-repeat bg-center bg-cover mx-auto w-full max-w-screen-xl aspect-[16/7] mt-4 overflow-hidden rounded-4xl h-96 md:h-full"
            style={{
                backgroundImage: "url('/MainBanner.png')",
            }}
        >
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/60 z-0 rounded-4xl"></div>

            {/* Content */}
            <div className="relative z-10 text-white">
                <h2 className="text-lg md:text-xl text-red-400 mb-2">Welcome To Car Rent</h2>

                <h1 className="text-3xl md:text-5xl font-bold leading-snug md:leading-tight mb-4">
                    Looking to save more on <br className="hidden md:block" />
                    your rental car?
                </h1>

                <p className="max-w-md md:max-w-xl mx-auto mb-6 text-sm md:text-base text-gray-300">
                    Whether you`&apos;`re planning a weekend getaway, a business trip, or just need a reliable ride for the day,
                    we offer a wide range of vehicles to suit your needs.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="btn bg-red-500 text-white hover:bg-red-600 px-6 py-2 text-sm md:text-base">
                        Book A Rental
                    </button>
                    <button className="btn btn-outline text-white border-white px-6 py-2 text-sm md:text-base">
                        Learn More
                    </button>
                </div>
            </div>
        </div>

    )
}

export default Banner
