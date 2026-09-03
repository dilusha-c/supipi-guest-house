"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/Calendar";
import { addDays, eachDayOfInterval } from "date-fns";

export default function AvailabilityCalendar() {
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch("/api/bookings/availability");
        const data = await res.json();
        
        if (data.bookings) {
          const dates: Date[] = [];
          data.bookings.forEach((b: any) => {
            const checkIn = new Date(b.checkIn);
            const checkOut = new Date(b.checkOut);
            // Get all days between checkin and checkout
            const interval = eachDayOfInterval({ start: checkIn, end: checkOut });
            dates.push(...interval);
          });
          setBookedDates(dates);
        }
      } catch (err) {
        console.error("Failed to fetch availability", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAvailability();
  }, []);

  return (
    <div className="bg-white p-6 md:p-10 rounded-[20px] border border-light-border shadow-sm mb-12">
      <div className="mb-6">
        <h2 className="font-heading text-2xl text-forest mb-2">Room Availability</h2>
        <p className="text-muted text-sm">Check our calendar for open dates before submitting your booking request.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex-1 w-full flex justify-center bg-cream/20 p-4 rounded-2xl border border-light-border">
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-muted">Loading calendar...</div>
          ) : (
            <Calendar
              mode="multiple"
              selected={bookedDates}
              numberOfMonths={typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1}
              disabled={[{ before: new Date() }]}
              className="w-full bg-transparent border-none shadow-none pointer-events-none"
              modifiers={{
                booked: bookedDates,
                available: [{ after: new Date() }]
              }}
              modifiersClassNames={{
                booked: "bg-red-100 text-red-600 line-through opacity-60",
                available: "bg-green-50 text-green-700"
              }}
            />
          )}
        </div>
        
        <div className="w-full md:w-48 shrink-0 flex flex-col gap-4 justify-center">
          <div className="flex items-center gap-3 bg-green-50 p-3 rounded-xl border border-green-100">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-green-800">Available</span>
          </div>
          <div className="flex items-center gap-3 bg-red-50 p-3 rounded-xl border border-red-100">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-red-800">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
