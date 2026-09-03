import Image from "next/image";
import SectionHeading from "../ui/SectionHeading";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function RoomSection() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          title="Comfortable Rooms" 
          subtitle="A Place to Rest"
          align="center"
        />

        <div className="max-w-4xl mx-auto">
          <div className="card group cursor-pointer border border-light-border hover:border-sage/50 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <Image
                  src="/images/bedroom.jpg"
                  alt="Comfortable guest room at Supipi Guest House"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                <h3 className="font-heading text-2xl md:text-3xl text-forest mb-4">Comfortable Guest Room</h3>
                <p className="text-muted leading-relaxed mb-8">
                  Our guest house provides a fully equipped space to relax after exploring Haputale. It comfortably accommodates up to 4 guests with two beds, a private bathroom, kitchen, living area, and a balcony to enjoy the scenic views.
                </p>
                <Link 
                  href="/rooms" 
                  className="inline-flex items-center text-forest font-medium hover:text-sage transition-colors group/link w-fit"
                >
                  View Room
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
