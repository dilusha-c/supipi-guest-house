import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all bookings that are CONFIRMED or PENDING
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PENDING'] }
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true
      }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Availability Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
