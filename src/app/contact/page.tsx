import { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";
import { businessConfig } from "@/config/business";

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

            {/* Inquiry Form */}
            <div className="bg-white p-8 rounded-[14px] border border-light-border shadow-sm">
              <h3 className="font-heading text-xl text-forest mb-6">Send an Inquiry</h3>
              <p className="text-sm text-muted mb-8">
                Please contact us directly by phone or WhatsApp for immediate assistance. Alternatively, you can use this form.
              </p>
              
              <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark mb-1">Name</label>
                  <input type="text" id="name" className="w-full px-4 py-3 rounded-[10px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50" placeholder="Your name" />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-dark mb-1">Phone</label>
                  <input type="tel" id="phone" className="w-full px-4 py-3 rounded-[10px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50" placeholder="Your phone number" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkin" className="block text-sm font-medium text-dark mb-1">Check-in</label>
                    <input type="date" id="checkin" className="w-full px-4 py-3 rounded-[10px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50" />
                  </div>
                  <div>
                    <label htmlFor="checkout" className="block text-sm font-medium text-dark mb-1">Check-out</label>
                    <input type="date" id="checkout" className="w-full px-4 py-3 rounded-[10px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50" />
                  </div>
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-dark mb-1">Guests</label>
                  <select id="guests" className="w-full px-4 py-3 rounded-[10px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4+ Guests</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-dark mb-1">Message</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-[10px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50 resize-none" placeholder="Any specific requirements or questions?"></textarea>
                </div>

                <button type="button" className="btn-primary w-full">
                  Send Inquiry
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
