import Link from "next/link";
import { businessConfig } from "@/config/business";
import { Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest text-cream pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex flex-col items-start leading-none mb-6">
              <span className="font-heading font-bold text-2xl tracking-wider uppercase text-white">
                SUPIPI
              </span>
              <span className="text-sm tracking-widest uppercase mt-1 text-cream/80">
                GUEST HOUSE
              </span>
            </div>
            <p className="text-cream/80 mb-6 max-w-sm">
              {businessConfig.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg text-white mb-6">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-cream/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/rooms" className="text-cream/80 hover:text-white transition-colors">Rooms</Link></li>
              <li><Link href="/gallery" className="text-cream/80 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/facilities" className="text-cream/80 hover:text-white transition-colors">Facilities</Link></li>
              <li><Link href="/location" className="text-cream/80 hover:text-white transition-colors">Location</Link></li>
              <li><Link href="/contact" className="text-cream/80 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-lg text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-muted-gold shrink-0 mt-0.5" />
                <span className="text-cream/80">{businessConfig.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-muted-gold shrink-0" />
                <a href={businessConfig.phoneLink} className="text-cream/80 hover:text-white transition-colors">
                  {businessConfig.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-muted-gold shrink-0" />
                <a href={`mailto:${businessConfig.email}`} className="text-cream/80 hover:text-white transition-colors">
                  {businessConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-cream/60">
          <p>&copy; {currentYear} {businessConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
