import { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import LocationSection from "@/components/home/LocationSection";

export const metadata: Metadata = {
  title: "Location | Supipi Guest House",
  description: "Find Supipi Guest House in Haputale, Sri Lanka. Directions and interactive map.",
};

export default function LocationPage() {
  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen flex flex-col">
      <div className="container mx-auto px-4 md:px-6 mb-8 text-center max-w-3xl">
        <SectionHeading 
          title="Getting Here" 
          subtitle="Location"
          align="center"
        />
        <p className="text-lg text-muted">
          We are located in the beautiful hill country of Haputale, offering a peaceful retreat while remaining accessible for travelers.
        </p>
      </div>

      <div className="flex-grow">
        <LocationSection />
      </div>
    </div>
  );
}
