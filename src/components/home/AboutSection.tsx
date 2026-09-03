import Image from "next/image";
import SectionHeading from "../ui/SectionHeading";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { businessConfig } from "@/config/business";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-cream">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Image Column */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-[14px] overflow-hidden shadow-md">
            <Image
              src="/images/bedroom-wide.jpg"
              alt="Comfortable guest room at Supipi Guest House"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Text Column */}
          <div>
            <SectionHeading 
              title="Welcome to Supipi Guest House" 
              subtitle="Our Story"
            />
            
            <div className="prose prose-lg text-muted mb-8">
              <p className="leading-relaxed">
                Discover a comfortable and peaceful place to stay in the beautiful hill country of Haputale. Supipi Guest House offers a simple, welcoming environment for travelers, families, and visitors looking to enjoy the natural surroundings of Sri Lanka's central highlands.
              </p>
              <p className="leading-relaxed">
                Relax in peaceful surroundings and enjoy the natural scenery while exploring the area. Whether you are here for a short visit or a longer retreat, our doors are open to make you feel at home.
              </p>
            </div>

            <div className="flex items-center text-forest font-medium mb-10 bg-white/60 inline-flex px-4 py-2 rounded-full border border-light-border">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{businessConfig.city}, {businessConfig.country}</span>
            </div>

            <div>
              <Link href="/gallery" className="btn-primary">
                Discover Supipi
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
