import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch all upcoming bookings that are CONFIRMED or PENDING
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PENDING'] },
        checkOut: {
          gte: today
        }
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
