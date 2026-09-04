import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, amount } = body;

    if (!id || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
    }

    // Get current booking
    const currentBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!currentBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Add amount to existing amountPaid
    const newAmountPaid = (currentBooking.amountPaid || 0) + amount;

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
