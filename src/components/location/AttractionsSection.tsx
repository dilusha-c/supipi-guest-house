import React from 'react';
import Image from 'next/image';
import { attractions, AttractionCategory } from '@/data/attractions';
import { MapPin, Star, Info } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const categories: AttractionCategory[] = [
  "Viewpoints & Historic Sites",
  "Waterfalls & Nature",
  "Around Bandarawela",
  "Horton Plains"
];

export default function AttractionsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionHeading 
            title="Explore Haputale" 
            subtitle="Local Attractions"
            align="center"
          />
          <p className="text-lg text-muted mt-6">
            Discover the breathtaking beauty of Sri Lanka&apos;s hill country. From panoramic viewpoints to cascading waterfalls, Haputale offers unforgettable experiences just a short trip from our guest house.
          </p>
        </div>

        <div className="space-y-20">
          {categories.map((category) => {
            const categoryAttractions = attractions.filter(a => a.category === category);
            if (categoryAttractions.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-2xl font-heading text-forest mb-8 border-b border-forest/10 pb-4">
                  {category}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryAttractions.map((attraction) => (
                    <div 
                      key={attraction.id} 
                      className="bg-cream rounded-2xl border border-light-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group overflow-hidden"
                    >
                      {attraction.image && (
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src={attraction.image}
                            alt={attraction.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4 gap-2">
                          <h4 className="text-xl font-heading text-forest group-hover:text-sage transition-colors">
                            {attraction.name}
                          </h4>
                        {attraction.rating && (
                          <div className="flex items-center bg-white px-2 py-1 rounded-lg border border-light-border shadow-sm">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                            <span className="text-sm font-medium text-dark">{attraction.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm font-medium text-sage mb-4 bg-sage/10 w-fit px-3 py-1 rounded-full">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        {attraction.type}
                      </div>
                      
                      <p className="text-muted mb-6 flex-grow">
                        {attraction.description}
                      </p>
                      
                      <div className="bg-white p-4 rounded-xl border border-light-border mt-auto flex items-start">
                        <Info className="w-5 h-5 text-forest shrink-0 mr-3 mt-0.5" />
                        <p className="text-sm text-dark font-medium leading-relaxed">
                          {attraction.tip}
                        </p>
                      </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
