import CarSection from "@/Components/CarSection";
import Footer from "@/Components/Footer";
import Banner from "@/Components/MainBanner";
import Navbar from "@/Components/Navbar";
import PartnerSection from "@/Components/PartnerSection";
import Service from "@/Components/Service";
import Image from "next/image";

export default function Home() {
    return (
        <div>
            <section className="w-[1440px} mx-auto">
                <Navbar />
                <Banner />
                <PartnerSection />
                <Service />
                <CarSection />
                <Footer />
            </section>
        </div>
    );
}
