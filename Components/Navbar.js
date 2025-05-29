/* eslint-disable @next/next/no-img-element */
'use client'
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import React, { useState } from 'react'
import { FaLocationArrow } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";

function Navbar() {
    const [openMenu, setOpenMenu] = useState(null)
    const { user, logout, loading } = useAuth();

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu)
    }

    return (
        <div className="navbar bg-white text-black shadow-sm px-6 lg:px-64 mx-auto sticky top-0 z-50">
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
                </div>

                <Link href={'/'} className="text-3xl font-black"> <span className="text-red-500">Driver</span>Ly</Link>

            </div>

            {/* Navbar Center */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-1">
                    {['Cars'].map((menu) => (
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
                    <Link href='/about' className="btn btn-ghost">
                        About Us
                    </Link>
                    <Link href='/contact' className="btn btn-ghost">
                        Contact Us
                    </Link>
                </ul>
            </div>

            {/* Navbar End */}
            <div className="navbar-end">
                {
                    loading && (
                        <div className="btn btn-ghost loading"></div>
                    )
                }
                {
                    !loading && !user && (
                        <Link href='/login' className="btn btn-ghost">
                            <FaLocationArrow className="text-xl" />
                        </Link>
                    )
                }
                {
                    user && user.role === 'user'
                    && (
                        <Link href='/book' >
                            <p className="btn bg-red-500 text-white hover:bg-red-600 rounded-full h-12">
                                Book A Rental
                            </p>
                        </Link>
                    )
                }

                {
                    user && user.role === 'admin' && (
                        <Link href='/dashboard/admin/bookings' >
                            <p className="btn bg-red-500 text-white hover:bg-red-600 rounded-full h-12">
                                Admin Dashboard
                            </p>
                        </Link>
                    )
                }

                {
                    user ?
                        <>
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10
                                    rounded-full">
                                        <img src={user?.profilePicture || '/avatar.jpg'} alt="User Avatar" />
                                    </div>
                                </label>
                                <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-white border border-amber-100 rounded-box w-52">
                                    <li>
                                        <Link href='/dashboard' className="justify-between">
                                            Dashboard
                                            <span className="badge">New</span>
                                        </Link>
                                    </li>
                                    {
                                        user.role === 'admin' && (
                                            <li>
                                                <Link href='/dashboard/admin/bookings'>Admin Panel</Link>
                                            </li>
                                        )
                                    }
                                    {
                                        user.role === 'user' && (
                                            <li>
                                                <Link href='/dashboard/bookings'>My Bookings</Link>
                                            </li>
                                        )
                                    }
                                    {
                                        user.role == "driver" && (
                                            <li>
                                                <Link href='/dashboard/driver/bookings'>My Dashboard</Link>
                                            </li>
                                        )

                                    }
                                    <li>
                                        <button onClick={logout} className="text-red-500">Logout</button>
                                    </li>
                                </ul>
                            </div>
                        </> :
                        <>
                            {
                                !loading && (
                                    <Link href='/login' className="btn btn-ghost">
                                        <FaLocationArrow className="text-xl" />
                                    </Link>
                                )
                            }
                        </>

                }
            </div>
        </div>
    )
}

export default Navbar
