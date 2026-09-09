import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, amount } = body;

    if (!id || typeof id !== 'string' || typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
      return NextResponse.json({ error: "Invalid payment data. Amount must be a positive finite number." }, { status: 400 });
    }

    // Get current booking
    const currentBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!currentBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Round amount to 2 decimal places to avoid floating point inaccuracies
    const roundedPayment = Math.round(amount * 100) / 100;
    const newAmountPaid = Math.round(((currentBooking.amountPaid || 0) + roundedPayment) * 100) / 100;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        amountPaid: newAmountPaid
      }
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Payment Log Error:", error);
    return NextResponse.json({ error: "Failed to log payment" }, { status: 500 });
  }
}
