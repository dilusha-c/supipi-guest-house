import { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import LocationSection from "@/components/home/LocationSection";
import AttractionsSection from "@/components/location/AttractionsSection";

export const metadata: Metadata = {
  title: "Location & Attractions | Supipi Guest House",
  description: "Find Supipi Guest House in Haputale, Sri Lanka. Explore local attractions like Lipton's Seat, waterfalls, and Horton Plains.",
};

export default function LocationPage() {
  return (
    <div className="pt-32 pb-0 bg-cream min-h-screen flex flex-col">
      <div className="container mx-auto px-4 md:px-6 mb-8 text-center max-w-3xl">
        <SectionHeading 
          title="Location & Attractions" 
          subtitle="Explore Haputale"
          align="center"
        />
        <p className="text-lg text-muted">
          We are located in the beautiful hill country of Haputale, offering a peaceful retreat while remaining accessible to all the breathtaking local sights.
        </p>
      </div>

      <div className="flex-grow">
        <LocationSection />
        <AttractionsSection />
      </div>
    </div>
  );
}
