import { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import { Phone, MessageCircle, MapPin, Mail, CalendarCheck } from "lucide-react";
import { businessConfig } from "@/config/business";
import BookingCTA from "@/components/ui/BookingCTA";

export const metadata: Metadata = {
  title: `Contact | ${businessConfig.name}`,
  description: "Contact Supipi Guest House for availability, reservations, and further information.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-32 bg-cream min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeading 
            title="Plan Your Stay" 
            subtitle="Contact Us"
            align="center"
          />
          <p className="text-center text-muted text-lg mb-16 max-w-2xl mx-auto">
            Contact Supipi Guest House for availability, reservations, and further information. We look forward to welcoming you to Haputale.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[14px] border border-light-border shadow-sm">
                <h3 className="font-heading text-xl text-forest mb-6">Direct Contact</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 mr-4 text-sage shrink-0" />
                    <div>
                      <span className="block text-sm text-muted mb-1">Phone</span>
                      <a href={businessConfig.phoneLink} className="text-lg font-medium text-dark hover:text-forest transition-colors">
                        {businessConfig.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 mr-4 text-sage shrink-0" />
                    <div>
                      <span className="block text-sm text-muted mb-1">Email</span>
                      <a href={`mailto:${businessConfig.email}`} className="text-lg font-medium text-dark hover:text-forest transition-colors">
                        {businessConfig.email}
                      </a>
                    </div>
                  </div>

                  {businessConfig.whatsappEnabled && (
                    <div className="flex items-start">
                      <MessageCircle className="w-6 h-6 mr-4 text-[#25D366] shrink-0" />
                      <div>
                        <span className="block text-sm text-muted mb-1">WhatsApp</span>
                        <a 
                          href={`https://wa.me/${businessConfig.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-dark hover:text-[#25D366] transition-colors"
                        >
                          {businessConfig.whatsappNumber}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 mr-4 text-sage shrink-0" />
                    <div>
                      <span className="block text-sm text-muted mb-1">Location</span>
                      <address className="not-italic text-lg text-dark">
                        {businessConfig.address}
                      </address>
                      <a 
                        href={businessConfig.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-forest font-medium hover:underline"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Now Section */}
            <div className="bg-forest p-8 rounded-[14px] border border-forest-light shadow-lg text-white flex flex-col justify-center items-center text-center h-full min-h-[400px]">
              <CalendarCheck className="w-16 h-16 text-sage mb-6" strokeWidth={1.5} />
              <h3 className="font-heading text-3xl mb-4">Ready to Book?</h3>
              <p className="text-cream/90 mb-8 max-w-sm">
                Check our availability calendar and secure your reservation online instantly.
              </p>
              
              <BookingCTA className="bg-white text-forest hover:bg-cream border-none w-full md:w-auto px-8 py-4 text-lg rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                Book Now
              </BookingCTA>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
