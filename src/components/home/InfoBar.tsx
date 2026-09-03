import { MapPin, Home, Trees, CalendarCheck } from "lucide-react";
import { businessConfig } from "@/config/business";

const infoItems = [
  {
    icon: MapPin,
    title: businessConfig.city,
    description: "Sri Lanka",
  },
  {
    icon: Home,
    title: "Comfortable",
    description: "Accommodation",
  },
  {
    icon: Trees,
    title: "Natural",
    description: "Surroundings",
  },
  {
    icon: CalendarCheck,
    title: "Direct",
    description: "Booking",
  },
];

export default function InfoBar() {
  return (
    <section className="bg-white border-b border-light-border relative z-30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 md:py-12">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-forest mb-1">
                <item.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-dark font-medium text-sm md:text-base">{item.title}</h3>
                <p className="text-muted text-xs md:text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
