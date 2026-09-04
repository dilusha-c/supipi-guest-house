import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PieChart as PieChartIcon } from "lucide-react";
import FinanceDashboardContainer from "@/components/admin/FinanceDashboardContainer";

export default async function FinancePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/123@supipiadmin-re/login");
  }

  // Fetch all expenses
  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" }
  });

  // Fetch all bookings with payments to use as Income
  const bookings = await prisma.booking.findMany({
    where: { amountPaid: { gt: 0 } },
    select: { 
      id: true,
      bookingReference: true,
      guestName: true,
      amountPaid: true,
      createdAt: true 
    },
    orderBy: { createdAt: "desc" }
  });

  const incomes = bookings.map(b => ({
    id: b.id,
    bookingReference: b.bookingReference,
    guestName: b.guestName,
    amountPaid: b.amountPaid,
    date: b.createdAt
  }));

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading text-forest flex items-center">
          <PieChartIcon className="w-8 h-8 mr-3 text-sage" />
          Financial Analytics
        </h1>
      </div>

      <FinanceDashboardContainer 
        initialExpenses={expenses} 
        initialIncomes={incomes} 
      />
    </div>
  );
}
