import Hero from "@/components/home/Hero";
import InfoBar from "@/components/home/InfoBar";
import dynamic from 'next/dynamic';

const AboutSection = dynamic(() => import("@/components/home/AboutSection"));
const NatureSection = dynamic(() => import("@/components/home/NatureSection"));
const RoomSection = dynamic(() => import("@/components/home/RoomSection"));
const FacilitiesSection = dynamic(() => import("@/components/home/FacilitiesSection"));
const ReviewSection = dynamic(() => import("@/components/home/ReviewSection"));
const LocationSection = dynamic(() => import("@/components/home/LocationSection"));
import BookingCTA from "@/components/ui/BookingCTA";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Home() {
  return (
    <>
      <Hero />
      <InfoBar />
      <AboutSection />
      <NatureSection />
      <RoomSection />
      <FacilitiesSection />
      <ReviewSection />
      <LocationSection />
      
      {/* Final Booking CTA */}
      <section className="py-24 bg-forest text-cream text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,theme(colors.cream)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <SectionHeading 
              title="Planning a Stay in Haputale?" 
              align="center"
              light
              className="mb-6"
            />
            <p className="text-lg text-cream/90 mb-10 font-light">
              Contact Supipi Guest House to check availability and make your reservation.
            </p>
            <BookingCTA variant="secondary" className="bg-white text-forest border-white hover:bg-transparent hover:text-white">
              Contact Us
            </BookingCTA>
          </div>
        </div>
      </section>
    </>
  );
}
