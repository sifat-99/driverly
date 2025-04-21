'use client'
import React, { useState } from 'react'
import { FaLocationArrow } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";

function Navbar() {
    const [openMenu, setOpenMenu] = useState(null)

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu)
    }

    return (
        <div className="navbar bg-white text-black shadow-sm px-6 lg:px-64 mx-auto">
            {/* Navbar Start */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-amber-100 rounded-box w-52"
                    >
                        <li>
                            <a>Home</a>
                            <ul className="p-2">
                                <li><a>Rent</a></li>
                                <li><a>Cars</a></li>
                            </ul>
                        </li>
                        <li><a>About Us</a></li>
                        <li>
                            <a>Service</a>
                            <ul className="p-2">
                                <li><a>Chauffeur Service</a></li>
                                <li><a>Airport Pickup</a></li>
                            </ul>
                        </li>
                        <li>
                            <a>Cars</a>
                            <ul className="p-2">
                                <li><a>Luxury Cars</a></li>
                                <li><a>SUVs</a></li>
                            </ul>
                        </li>
                        <li>
                            <a>Pages</a>
                            <ul className="p-2">
                                <li><a>Testimonials</a></li>
                                <li><a>FAQs</a></li>
                            </ul>
                        </li>
                        <li><a>Contact Us</a></li>
                    </ul>
                </div>

                <p className="text-3xl font-black"> <span className="text-red-500">Driver</span>Ly</p>

            </div>

            {/* Navbar Center */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-1">
                    {['Home', 'Service', 'Cars', 'Pages'].map((menu) => (
                        <li key={menu} className="relative">
                            <button
                                className="btn btn-ghost"
                                onClick={() => toggleMenu(menu)}
                            >
                                {menu} <FaArrowDown />
                            </button>
                            {openMenu === menu && (
                                <ul className="absolute top-full left-0 mt-2 p-2 bg-white border border-amber-100 rounded-box w-48 z-10">
                                    {menu === 'Home' && (
                                        <>
                                            <li><a>Rent</a></li>
                                            <li><a>Cars</a></li>
                                        </>
                                    )}
                                    {menu === 'Service' && (
                                        <>
                                            <li><a>Chauffeur Service</a></li>
                                            <li><a>Airport Pickup</a></li>
                                        </>
                                    )}
                                    {menu === 'Cars' && (
                                        <>
                                            <li><a>Luxury Cars</a></li>
                                            <li><a>SUVs</a></li>
                                            <li><a>Small Cars</a></li>
                                            <li><a>Small Cars</a></li>
                                        </>
                                    )}
                                    {menu === 'Pages' && (
                                        <>
                                            <li><a>Testimonials</a></li>
                                            <li><a>FAQs</a></li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}
                    <button
                        className="btn btn-ghost"
                    >
                        About Us
                    </button>
                    <button
                        className="btn btn-ghost"
                    >
                        Contact Us
                    </button>
                </ul>
            </div>

            {/* Navbar End */}
            <div className="navbar-end">
                <a className="btn bg-red-500 text-white hover:bg-red-600 rounded-full h-12">
                    Book A Rental
                </a>
                <a className="btn bg-red-500 text-white hover:bg-red-600 rounded-full w-12 h-12 ml-2">
                    <FaLocationArrow />
                </a>
            </div>
        </div>
    )
}

export default Navbar
