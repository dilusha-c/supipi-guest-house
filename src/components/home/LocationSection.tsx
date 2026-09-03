import SectionHeading from "../ui/SectionHeading";
import { MapPin, Navigation } from "lucide-react";
import { businessConfig } from "@/config/business";

export default function LocationSection() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div>
            <SectionHeading 
              title="Discover Haputale" 
              subtitle="Location"
            />
            
            <p className="text-lg text-muted mb-8 leading-relaxed">
              Stay in Haputale and enjoy the peaceful atmosphere of Sri Lanka's hill country. We are conveniently located to allow you to easily explore the surrounding natural beauty.
            </p>
            
            <div className="bg-cream p-6 md:p-8 rounded-[14px] border border-light-border mb-8">
              <h3 className="font-heading text-xl text-forest mb-4">Property Address</h3>
              <div className="flex items-start text-dark mb-6">
                <MapPin className="w-5 h-5 mr-3 text-sage shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed">
                  <strong>{businessConfig.name}</strong><br />
                  {businessConfig.address}
                </address>
              </div>
              <a 
                href={businessConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-forest font-medium hover:text-sage transition-colors"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </a>
            </div>
          </div>

          {/* Map Image / Embed */}
          <div className="relative h-[400px] md:h-[500px] rounded-[14px] overflow-hidden shadow-md bg-cream border border-light-border">
            {businessConfig.googleMapsEmbedUrl ? (
              <iframe
                src={businessConfig.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title={`Map of ${businessConfig.name}`}
              ></iframe>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <MapPin className="w-12 h-12 text-forest/20 mb-4" />
                <p className="text-muted mb-6">Interactive map will be available soon.</p>
                <a 
                  href={businessConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary py-2"
                >
                  View on Google Maps
                </a>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
