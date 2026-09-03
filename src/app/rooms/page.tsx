import { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingCTA from "@/components/ui/BookingCTA";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Comfortable Rooms | Supipi Guest House",
  description: "View our comfortable and simple guest room at Supipi Guest House, Haputale.",
};

const roomFeatures = [
  "2 Comfortable beds (sleeps up to 4 guests)",
  "Private kitchen",
  "Private bathroom",
  "Balcony with scenic views",
  "Spacious living area",
];

export default function RoomsPage() {
  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-32 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          title="Comfortable Guest Room" 
          subtitle="Our Room"
          align="center"
        />

        <div className="max-w-6xl mx-auto mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Images */}
            <div className="space-y-6">
              <div className="relative h-[400px] md:h-[500px] rounded-[14px] overflow-hidden shadow-sm border border-light-border">
                <Image
                  src="/images/bedroom-wide.jpg"
                  alt="Wider view of the bedroom at Supipi Guest House"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="relative h-48 rounded-[14px] overflow-hidden shadow-sm border border-light-border">
                  <Image
                    src="/images/bedroom.jpg"
                    alt="Comfortable bed at Supipi Guest House"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="relative h-48 rounded-[14px] overflow-hidden shadow-sm border border-light-border">
                  <Image
                    src="/images/greenery-window.jpg"
                    alt="View from the room"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h2 className="font-heading text-3xl md:text-4xl text-forest mb-6">A Place to Rest</h2>
              <div className="prose prose-lg text-muted mb-10">
                <p>
                  Our guest house provides a fully equipped and comfortable space to relax after exploring Haputale and the surrounding hill country. It perfectly accommodates up to 4 guests, making it ideal for families or small groups.
                </p>
                <p>
                  The space includes two comfortable beds, a private bathroom, a dedicated living area, and your own kitchen. Step out onto the balcony to enjoy the fresh air, natural light, and serene hill-country atmosphere.
                </p>
              </div>

              <div className="mb-10">
                <h3 className="font-heading text-xl text-forest mb-4">Room Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roomFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-dark">
                      <Check className="w-5 h-5 text-sage mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-cream p-8 rounded-[14px] border border-light-border">
                <h3 className="font-heading text-xl text-forest mb-2">Interested in staying?</h3>
                <p className="text-muted mb-6">Contact us directly for availability and pricing.</p>
                <BookingCTA className="w-full sm:w-auto" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
