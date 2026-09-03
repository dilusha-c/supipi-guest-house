import Image from "next/image";
import SectionHeading from "../ui/SectionHeading";

export default function NatureSection() {
  return (
    <section className="relative py-32 md:py-48 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/greenery-window.jpg" // Using the greenery view
          alt="Green natural surroundings viewed from Supipi Guest House"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-forest/70 z-10" />
      </div>

      <div className="container relative z-20 mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <SectionHeading 
            title="Wake Up to the Beauty of Haputale" 
            subtitle="NATURE • PEACE • HAPUTALE"
            align="center"
            light
            className="mb-8"
          />
          <p className="text-lg md:text-xl text-cream/90 font-light leading-relaxed">
            Take a break from busy city life and enjoy the greenery, fresh surroundings and peaceful atmosphere of Haputale. Relax in peaceful surroundings and enjoy views of the green hills and natural landscape.
          </p>
        </div>
      </div>
    </section>
  );
}
