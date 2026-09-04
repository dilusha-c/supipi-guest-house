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
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 mb-5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-heading tracking-[0.25em] text-xs md:text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 font-semibold">
              Supipi Guest House • Haputale
            </span>
          </div>

          <h1 className="text-4xl md:text-[54px] lg:text-[66px] font-heading font-bold leading-[1.15] mb-6 drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200">
              A Peaceful Stay in the{" "}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-emerald-300">
              Hills of Haputale
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Enjoy a comfortable and welcoming stay surrounded by the{" "}
            <span className="text-emerald-300 font-medium">natural beauty</span> of{" "}
            <span className="text-amber-300 font-medium">Haputale, Sri Lanka</span>.
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
