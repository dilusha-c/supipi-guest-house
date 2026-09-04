import { Metadata } from "next";
import BookingForm from "@/components/booking/BookingForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Your Stay | Supipi Guest House",
  description: "Send a booking request for Supipi Guest House in Haputale, Sri Lanka.",
};

import AvailabilityCalendar from "@/components/booking/AvailabilityCalendar";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function BookingPage() {
  const settings = await prisma.settings.findUnique({
    where: { id: "global" }
  });

  const basePrice = settings?.basePrice || 50;
  const hidePrice = settings?.hidePrice ?? false;

  return (
    <main className="pt-24 pb-20 bg-[#FAF9F6] min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Breadcrumb & Header */}
        <div className="mb-12 pt-8">
          <nav className="flex text-sm text-muted mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-forest transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-dark">Booking</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <h1 className="text-4xl md:text-[52px] font-heading font-medium text-forest mb-4">
            Book Your Stay
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Choose your preferred dates and send us a reservation request. We will get back to you shortly to confirm availability and pricing.
          </p>
        </div>

        {/* Availability Calendar */}
        <AvailabilityCalendar />

        {/* Form Container */}
        <BookingForm basePrice={basePrice} hidePrice={hidePrice} />

      </div>
    </main>
  );
}
