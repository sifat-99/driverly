'use client'
import React from 'react'
import Image from 'next/image'

const PartnerSection = () => {
    const processes = [
        {
            icon: '/Booking.png', // Replace with your actual image paths
            title: 'Easy Booking Process',
            description:
                'We have optimized the booking process so that our clients can experience the easiest and the safest service.',
        },
        {
            icon: 'pickup.png', // Replace with your actual image paths
            title: 'Convenient Pick-Up & Return Process',
            description:
                'We have optimized the booking process so that our clients can experience the easiest and the safest service.',
        },
    ]
    return (
        <div className='text-black flex flex-col lg:flex-row items-center justify-center gap-28 lg:px-52 lg:mx-auto mt-10'>
            <Image src="/trustedPartner.png" alt="Trusted Partner" width={500} height={300} />
            <div className=''>
                <p className='text-red-500'>* About us</p>
                <h2 className="text-lg md:text-4xl text-black mb-2 w-1/2 font-black">Your trusted partner in
                    reliable car rental</h2>
                <p className="max-w-md md:max-w-xl  mb-6 text-sm md:text-base text-gray-300">
                    Our partners are the backbone of our success. We work with the best in the industry to provide you with
                    top-notch service and quality vehicles.
                </p>

                <div className="max-w-3xl mx-auto py-12 space-y-8">
                    {processes.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <img src={item.icon} alt={item.title} className="w-14 h-14" />
                            <div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-gray-500 mt-1 w-2/3">{item.description}</p>
                            </div>
                        </div>
                    ))}

                    <div className="pt-6">
                        <button className="btn bg-red-500 text-white hover:bg-red-600">
                            Contact Us
                            <span className="ml-2">➝</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PartnerSection
