import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Settings, Image as ImageIcon, LogOut, Users, PieChart } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#FAF9F6]">
      {/* Sidebar */}
      <aside className="w-64 bg-forest text-cream flex flex-col hidden md:flex shrink-0">
        <div className="p-6">
          <div className="font-heading text-xl font-bold uppercase tracking-wider text-white">
            Supipi Admin
          </div>
          <div className="text-xs text-sage mt-1">Management Portal</div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/123@supipiadmin-re" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Bookings</span>
          </Link>
          
          <Link href="/123@supipiadmin-re/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-cream/70 hover:bg-white/10 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings & Pricing</span>
          </Link>

          <Link href="/123@supipiadmin-re/gallery" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-cream/70 hover:bg-white/10 hover:text-white transition-colors">
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Photo Gallery</span>
          </Link>
          
          <Link href="/123@supipiadmin-re/guests" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-cream/70 hover:bg-white/10 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Guests (CRM)</span>
          </Link>

          <Link href="/123@supipiadmin-re/finance" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-cream/70 hover:bg-white/10 hover:text-white transition-colors">
            <PieChart className="w-5 h-5" />
            <span className="font-medium">Financial Analytics</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/api/auth/signout" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-cream/70 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-forest text-white p-4 flex justify-between items-center sticky top-0 z-40">
          <div className="font-heading font-bold uppercase tracking-wider">Supipi Admin</div>
          {/* A real app might have a hamburger menu here, for now keeping it simple */}
        </header>

        <main className="p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
