import { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import FacilitiesSection from "@/components/home/FacilitiesSection";

export const metadata: Metadata = {
  title: "Facilities | Supipi Guest House",
  description: "Explore the simple and comfortable facilities offered at Supipi Guest House in Haputale.",
};

export default function FacilitiesPage() {
  return (
    <div className="pt-32 bg-cream min-h-screen">
      <div className="container mx-auto px-4 md:px-6 mb-16">
        <SectionHeading 
          title="Our Facilities" 
          subtitle="What We Offer"
          align="center"
        />
        <p className="text-center text-muted text-lg max-w-2xl mx-auto">
          We focus on providing the essential comforts to make your stay in the beautiful surroundings of Haputale relaxing and enjoyable.
        </p>
      </div>
      
      {/* Reusing the homepage facilities section, which already has the confirmed facilities */}
      <div className="border-t-0">
        <FacilitiesSection />
      </div>
    </div>
  );
}
