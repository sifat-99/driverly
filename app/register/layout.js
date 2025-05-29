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
    title: "Register - DriverLy",
    description: "Create your DriverLy account.",
};

export default function OtherPageLayout({ children }) {
    return (
        <html lang="en" foxified=""
            webcrx="">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white `}
            >
                <Navbar />
                {children}
            </body>
        </html>
    );
}
