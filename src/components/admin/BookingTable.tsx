"use client";

import { useState } from "react";
import { Check, X, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Booking = {
  id: string;
  bookingReference: string;
  guestName: string;
  email: string | null;
  phone: string;
  checkIn: Date | string;
  checkOut: Date | string;
  adults: number;
  children: number;
  status: string;
  createdAt: Date | string;
};

export default function BookingTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        
        if (newStatus === "CONFIRMED") {
          alert("Booking Confirmed! An email has been sent to the guest if they provided an email address.");
        }
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-[16px] shadow-sm border border-light-border overflow-hidden">
        <div className="p-6 border-b border-light-border bg-cream/30">
          <h2 className="text-xl font-heading text-forest">Recent Booking Requests</h2>
        </div>
        <div className="p-6 text-center text-muted">
          No bookings found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-light-border overflow-hidden">
      <div className="p-6 border-b border-light-border bg-cream/30">
        <h2 className="text-xl font-heading text-forest">Recent Booking Requests</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted uppercase bg-cream/10 border-b border-light-border">
            <tr>
              <th className="px-6 py-4 font-medium">Ref / Guest</th>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-light-border hover:bg-cream/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-dark">{booking.bookingReference}</div>
                  <div className="text-muted mt-1">{booking.guestName}</div>
                  <div className="text-xs text-muted mt-1">{booking.adults} Adults, {booking.children} Children</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-dark">{new Date(booking.checkIn).toLocaleDateString()}</div>
                  <div className="text-muted text-xs mx-2">to</div>
                  <div className="font-medium text-dark">{new Date(booking.checkOut).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-dark font-medium">{booking.phone}</div>
                  {booking.email && (
                    <div className="flex items-center text-muted text-xs mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {booking.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-full",
                    booking.status === 'PENDING' && "bg-amber-100 text-amber-700",
                    booking.status === 'CONFIRMED' && "bg-green-100 text-green-700",
                    booking.status === 'REJECTED' && "bg-red-100 text-red-700",
                    booking.status === 'CANCELLED' && "bg-gray-100 text-gray-700",
                  )}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {booking.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                        disabled={updatingId === booking.id}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                        title="Accept Booking"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => updateStatus(booking.id, 'REJECTED')}
                        disabled={updatingId === booking.id}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                        title="Reject Booking"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
