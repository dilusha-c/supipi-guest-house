import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, Calendar, Settings, FileImage } from "lucide-react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import BookingTable from "@/components/admin/BookingTable";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }
  
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" }
  });
  
  const pendingCount = bookings.filter(b => b.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20">
      {/* Top Navbar */}
      <header className="bg-forest text-cream py-4 shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider">
            Supipi Admin
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm hidden md:inline-block opacity-80">Logged in as Admin</span>
            <Link href="/api/auth/signout" className="btn-secondary py-1.5 px-4 text-xs bg-transparent border-cream text-cream hover:bg-cream hover:text-forest">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 mt-8 max-w-6xl">
        <h1 className="text-3xl font-heading text-forest mb-8">Dashboard Overview</h1>
        
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
