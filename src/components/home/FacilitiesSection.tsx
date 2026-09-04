import SectionHeading from "../ui/SectionHeading";
import { Bed, Map, Mountain, Car } from "lucide-react";

const facilitiesData = [
  {
    title: "Comfortable accommodation",
    description: "Simple, clean, and comfortable spaces for a restful stay.",
    icon: Bed
  },
  {
    title: "Natural surroundings",
    description: "Surrounded by greenery and the beautiful landscapes of the hill country.",
    icon: Mountain
  },
  {
    title: "Convenient Haputale location",
    description: "A great base for exploring the central highlands and local attractions.",
    icon: Map
  },
  {
    title: "Free Parking Available",
    description: "Secure, complimentary parking on the premises for all our guests.",
    icon: Car
  }
];

export default function FacilitiesSection() {
  return (
    <section className="py-20 md:py-32 bg-cream border-y border-light-border">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          title="What We Offer" 
          subtitle="Simple Comforts"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {facilitiesData.map((facility, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-[14px] border border-light-border shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 mx-auto bg-forest/5 text-forest rounded-full flex items-center justify-center mb-6">
                <facility.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-xl text-forest mb-3">{facility.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{facility.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
