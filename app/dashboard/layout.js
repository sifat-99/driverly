import Navbar from "@/Components/Navbar";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "User Dashboard - DriverLy",
    description: "View your profile and booking history.",
};

export default function DashboardLayout({ children }) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} font-sans text-white min-h-screen bg-white`}>
            <Navbar />
            <main className="container mx-auto p-6">
                {children}
            </main>
        </div>
    );
}
