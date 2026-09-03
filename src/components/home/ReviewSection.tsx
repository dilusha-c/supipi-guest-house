import SectionHeading from "../ui/SectionHeading";
import { Star } from "lucide-react";
import { businessConfig } from "@/config/business";

export default function ReviewSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center bg-cream/30 p-10 md:p-16 rounded-[20px] border border-light-border">
          <SectionHeading 
            title="Guest Reviews" 
            align="center"
            className="mb-6"
          />
          
          <div className="flex flex-col items-center justify-center space-y-4 mb-8">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-muted-gold text-muted-gold" />
              ))}
            </div>
            <div className="text-2xl font-heading text-forest">
              {businessConfig.rating.toFixed(1)} Google Rating
            </div>
          </div>
          
          <a 
            href={businessConfig.googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Read us on Google
          </a>
        </div>
      </div>
    </section>
  );
}
