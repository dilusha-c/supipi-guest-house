"use client";

import { useState } from "react";
import { Users, Phone, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GuestList({ guestsList }: { guestsList: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (guestsList.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-light-border">
        <Users className="w-12 h-12 text-sage mx-auto mb-4" />
        <h3 className="text-xl font-heading text-forest">No Guests Found</h3>
        <p className="text-muted mt-2">Bookings will appear here grouped by guest.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {guestsList.map((guest, idx) => {
        const isExpanded = expandedId === guest.phone;
        
        return (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-light-border overflow-hidden transition-all duration-200">
            {/* Header (Clickable) */}
            <div 
              onClick={() => setExpandedId(isExpanded ? null : guest.phone)}
              className="p-6 md:p-8 bg-forest/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-forest/10 transition-colors"
            >
              <div>
                <h2 className="text-2xl font-heading text-forest mb-2">{guest.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-muted">
                  {guest.phone && (
                    <span className="flex items-center"><Phone className="w-4 h-4 mr-1" /> {guest.phone}</span>
                  )}
                  {guest.email && (
                    <span className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {guest.email}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-4 md:gap-1 items-center md:items-end md:text-right">
                <div className="text-right">
                  <div className="text-sm text-muted">Lifetime Value</div>
                  <div className="text-xl font-bold text-forest">LKR {guest.totalSpent.toFixed(2)}</div>
                  <div className="text-xs text-sage font-medium">{guest.bookingCount} Completed Stays</div>
                </div>
                <div className="ml-2 text-forest">
                  {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </div>
              </div>
            </div>

            {/* Expanded Content (Booking History) */}
            {isExpanded && (
              <div className="p-6 border-t border-light-border animate-in slide-in-from-top-2 duration-200">
                <h3 className="text-sm font-bold text-dark uppercase tracking-wider mb-4 border-b border-light-border pb-2">Booking History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted">
                        <th className="pb-3 font-medium">Ref</th>
                        <th className="pb-3 font-medium">Dates</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Amount Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border">
                      {guest.bookings.map((b: any) => (
                        <tr key={b.id}>
                          <td className="py-3 font-medium text-dark">{b.bookingReference}</td>
                          <td className="py-3 text-muted">
                            {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <span className={cn(
                              "px-2 py-1 rounded text-xs font-medium",
                              b.status === 'CONFIRMED' ? "bg-green-100 text-green-700" :
                              b.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                              b.status === 'CANCELLED' ? "bg-gray-100 text-gray-700" :
                              "bg-red-100 text-red-700"
                            )}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-medium text-forest">
                            LKR {(b.amountPaid || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
