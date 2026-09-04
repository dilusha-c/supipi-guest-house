import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, Calendar, Settings, FileImage } from "lucide-react";
import { prisma } from "@/lib/prisma";
import BookingTable from "@/components/admin/BookingTable";
import AddBookingHeader from "@/components/admin/AddBookingHeader";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/123@supipiadmin-re/login");
  }
  
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" }
  });
  
  const pendingCount = bookings.filter(b => b.status === "PENDING").length;

  return (
    <div className="pb-10">

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 mt-8 max-w-6xl">
        <AddBookingHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-white p-6 rounded-[16px] shadow-sm border border-light-border flex items-center">
            <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center mr-4">
              <Calendar className="w-7 h-7 text-forest" />
            </div>
            <div>
              <div className="text-sm text-muted uppercase tracking-wider font-medium">Pending Requests</div>
              <div className="text-3xl font-heading text-dark mt-1">{pendingCount}</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[16px] shadow-sm border border-light-border flex items-center">
            <div className="w-14 h-14 rounded-full bg-sage/20 flex items-center justify-center mr-4">
              <Settings className="w-7 h-7 text-sage" />
            </div>
            <div>
              <div className="text-sm text-muted uppercase tracking-wider font-medium">Pricing Status</div>
              <div className="text-lg font-medium text-dark mt-1">Hidden</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[16px] shadow-sm border border-light-border flex items-center">
            <div className="w-14 h-14 rounded-full bg-muted-gold/20 flex items-center justify-center mr-4">
              <FileImage className="w-7 h-7 text-muted-gold" />
            </div>
            <div>
              <div className="text-sm text-muted uppercase tracking-wider font-medium">Gallery Images</div>
              <div className="text-lg font-medium text-dark mt-1">Manage</div>
            </div>
          </div>
          
        </div>

        {/* Bookings Table */}
        <BookingTable initialBookings={bookings} />

      </main>
    </div>
  );
}
