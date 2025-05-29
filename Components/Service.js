import React from 'react'

const Service = () => {
    return (
        <section className="py-16 px-4 bg-red-50 rounded-xl text-black">
            <div className="max-w-screen-xl mx-auto text-center">
                <p className="text-red-500 font-semibold mb-2">★ Our Services</p>
                <h2 className="text-3xl font-bold mb-10">
                    Explore our wide range of rental services
                </h2>


                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    {[
                        { title: "Car Rental With Driver" },
                        { title: "Business Car Rental" },
                        { title: "Airport Transfer" },
                        { title: "Chauffeur Services" },
                    ].map((service, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                        >
                            <div className="text-4xl mb-4">🚗</div>
                            <h3 className="font-bold mb-2">{service.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Enhance your rental experience with additional options.
                            </p>
                            <button className="bg-red-500 w-10 h-10 rounded-full text-white text-lg">→</button>
                        </div>
                    ))}
                </div>

                <p className="text-sm text-gray-600 mt-10 mb-6 max-w-2xl mx-auto">
                    Discover our range of car rental services designed to meet all your travel needs. From a diverse
                    fleet of vehicles to flexible rental plans.
                </p>
                <button className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center gap-2 mx-auto">
                    View All Services →
                </button>
            </div>
        </section>

    )
}

export default Service
