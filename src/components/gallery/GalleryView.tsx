"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type GalleryImage = {
  id: string;
  url: string;
  caption: string;
};

export default function GalleryView({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-32 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          title="Gallery" 
          subtitle="Our Property"
          align="center"
        />
        
        {images.length === 0 ? (
          <div className="text-center mt-12 text-muted">
            Check back later for photos of our property.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto mt-12">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 6) * 0.1, duration: 0.5 }}
                className="relative h-64 md:h-80 cursor-pointer overflow-hidden rounded-[14px] group"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.url}
                  alt={image.caption || "Supipi Guest House"}
                  fill
                  priority={index < 4}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>
            
            <button 
              className="absolute left-4 md:left-10 text-white/70 hover:text-white p-4 z-50"
              onClick={prevImage}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <div className="relative w-full max-w-5xl h-[80vh] px-16" onClick={(e) => e.stopPropagation()}>
              <Image
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].caption || "Supipi Guest House"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              {images[lightboxIndex].caption && !/\.(jpg|jpeg|png|gif|webp)$/i.test(images[lightboxIndex].caption) && (
                <div className="absolute bottom-[-40px] left-0 right-0 text-center text-white/80">
                  {images[lightboxIndex].caption}
                </div>
              )}
            </div>

            <button 
              className="absolute right-4 md:right-10 text-white/70 hover:text-white p-4 z-50"
              onClick={nextImage}
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            
            <div className="absolute bottom-6 text-white/80 font-body">
              {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
