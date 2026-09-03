import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import { businessConfig } from '@/config/business';

const prisma = new PrismaClient();
// Instantiate Resend lazily to prevent build errors if the env variable is missing
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Admin Booking Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status or missing ID" }, { status: 400 });
    }

    // Update database
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    // If accepted, send email
    if (status === 'CONFIRMED' && booking.email && resend) {
      try {
        await resend.emails.send({
          from: `${businessConfig.name} <bookings@supipi.com>`, // Replace with your verified sender domain later
          to: [booking.email],
          subject: 'Booking Confirmed - Supipi Guest House',
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Your Booking is Confirmed!</h2>
              <p>Dear ${booking.guestName},</p>
              <p>We are delighted to confirm your booking request <strong>${booking.bookingReference}</strong> at ${businessConfig.name}.</p>
              <ul>
                <li><strong>Check-in:</strong> ${booking.checkIn.toLocaleDateString()}</li>
                <li><strong>Check-out:</strong> ${booking.checkOut.toLocaleDateString()}</li>
                <li><strong>Guests:</strong> ${booking.adults} Adults, ${booking.children} Children</li>
              </ul>
              <p>If you have any questions before your arrival, please reply to this email or contact us via WhatsApp at ${businessConfig.whatsappNumber}.</p>
              <br/>
              <p>Warm regards,</p>
              <p><strong>The ${businessConfig.name} Team</strong></p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // We still return success for the booking update, even if email fails
      }
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Admin Booking Update Error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
