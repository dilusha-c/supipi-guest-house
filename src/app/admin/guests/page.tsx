import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import GuestList from "@/components/admin/GuestList";

export default async function GuestsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/123@supipiadmin-re/login");
  }

  // Fetch all bookings (exclude pending/rejected if we only want confirmed, but for CRM we can fetch all and filter)
  const allBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" }
  });

  // Group by phone (primary identifier)
  const guestsMap = new Map<string, any>();

  for (const booking of allBookings) {
    const key = booking.phone || booking.email || booking.guestName;
    if (!key) continue;

    if (!guestsMap.has(key)) {
      guestsMap.set(key, {
        name: booking.guestName,
        phone: booking.phone,
        email: booking.email,
        totalSpent: 0,
        bookingCount: 0,
        lastVisit: booking.checkOut,
        bookings: []
      });
    }

    const guest = guestsMap.get(key);
    
    // Only count CONFIRMED or CANCELLED (if paid) towards total
    if (booking.status === 'CONFIRMED' || booking.amountPaid > 0) {
      guest.totalSpent += (booking.amountPaid || 0);
      if (booking.status === 'CONFIRMED') {
        guest.bookingCount += 1;
      }
    }

    guest.bookings.push(booking);
    // update last visit if this booking is more recent
    if (new Date(booking.checkOut) > new Date(guest.lastVisit)) {
      guest.lastVisit = booking.checkOut;
    }
  }

  const guestsList = Array.from(guestsMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading text-forest flex items-center">
          <Users className="w-8 h-8 mr-3 text-sage" />
          Guests (CRM)
        </h1>
      </div>

      <GuestList guestsList={guestsList} />
    </div>
  );
}
