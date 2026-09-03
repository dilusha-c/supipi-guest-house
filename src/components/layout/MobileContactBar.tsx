"use client";

import { businessConfig } from "@/config/business";
import { Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function MobileContactBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-light-border shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center h-16">
      <a
        href={businessConfig.phoneLink}
        className="flex-1 flex flex-col items-center justify-center h-full text-forest hover:bg-cream/50 transition-colors border-r border-light-border"
      >
        <Phone className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-medium uppercase tracking-wider">Call</span>
      </a>
      
      {businessConfig.whatsappEnabled ? (
        <a
          href={`https://wa.me/${businessConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center h-full text-[#25D366] hover:bg-cream/50 transition-colors"
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-forest">WhatsApp</span>
        </a>
      ) : (
        <Link
          href="/contact"
          className="flex-1 flex flex-col items-center justify-center h-full text-forest hover:bg-cream/50 transition-colors"
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Contact</span>
        </Link>
      )}
    </div>
  );
}
