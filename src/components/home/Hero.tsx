"use client";

import Image from "next/image";
import BookingCTA from "../ui/BookingCTA";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/mountain-view.jpg"
          alt="Beautiful mountain view from Supipi Guest House in Haputale"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Enhanced dark gradient overlay for optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75 z-10" />
      </div>

      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 md:px-6 text-center text-white flex-1 flex flex-col justify-center items-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl w-full flex flex-col items-center"
        >
          <span className="font-heading tracking-[0.25em] text-sm md:text-base uppercase mb-4 text-white/95 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] block">
            Supipi Guest House
          </span>
          <h1 className="text-4xl md:text-[52px] lg:text-[64px] font-heading font-semibold leading-[1.15] mb-6 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_14px_rgba(0,0,0,0.85)]">
            A Peaceful Stay in the Hills of Haputale
          </h1>
          <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Enjoy a comfortable and welcoming stay surrounded by the natural beauty of Haputale, Sri Lanka.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <BookingCTA className="w-full sm:w-auto" />
            <a
              href="#about"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent text-white border-2 border-white px-6 py-3 rounded-[12px] font-medium transition-all hover:bg-white hover:text-forest hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Supipi
            </a>
          </div>
        </motion.div>
      </div>

      {/* Location Indicator */}
      <div className="relative z-20 hidden md:flex flex-col items-center animate-bounce mt-auto pb-8 shrink-0">
        <span className="text-white/80 text-xs tracking-widest uppercase mb-2">Haputale, Sri Lanka</span>
        <div className="w-[1px] h-12 bg-white/50" />
      </div>
    </section>
  );
}
