import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';
import { businessConfig } from '@/config/business';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // 1. Verify cron authorization (Vercel Cron sends a Bearer token matching CRON_SECRET)
    // If not using Vercel Cron, you can pass a custom ?token=xyz
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    // Allow if CRON_SECRET matches, or a custom secret token is provided
    const CRON_SECRET = process.env.CRON_SECRET || 'supipi_cron_secret_2026';
    if (authHeader !== `Bearer ${CRON_SECRET}` && token !== CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Find bookings 2 days away
    const today = new Date();
    // 2 days from now (start of day)
    const twoDaysFromNowStart = new Date(today);
    twoDaysFromNowStart.setDate(today.getDate() + 2);
    twoDaysFromNowStart.setHours(0, 0, 0, 0);
    
    // 2 days from now (end of day)
    const twoDaysFromNowEnd = new Date(today);
    twoDaysFromNowEnd.setDate(today.getDate() + 2);
    twoDaysFromNowEnd.setHours(23, 59, 59, 999);

    const upcomingBookings = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        reminderSent: false,
        checkIn: {
          gte: twoDaysFromNowStart,
          lte: twoDaysFromNowEnd,
        },
      }
    });

    if (upcomingBookings.length === 0) {
      return NextResponse.json({ message: 'No reminders to send today.' });
    }

    let sentCount = 0;

    // 3. Send emails
    for (const booking of upcomingBookings) {
      if (!booking.email) continue;

      try {
        await sendEmail({
          to: booking.email,
          subject: `Reminder: Your upcoming stay at ${businessConfig.name}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; border-radius: 8px;">
              <div style="background-color: #2C5234; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 1px;">Upcoming Stay Reminder</h1>
                <p style="color: #e0e7e3; margin: 10px 0 0 0; font-size: 16px;">${businessConfig.name}</p>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 0;">Dear <strong>${booking.guestName}</strong>,</p>
                <p style="font-size: 16px; color: #555555; line-height: 1.6;">We are excited to welcome you in just a couple of days! This is a quick reminder about your upcoming stay.</p>
                
                <div style="background-color: #f9fbf9; border: 1px solid #e2ece5; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center;">
                  <p style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Booking Reference</p>
                  <p style="font-size: 24px; color: #2C5234; font-weight: bold; letter-spacing: 2px; margin: 0;">${booking.bookingReference}</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><strong style="color: #333;">Check-in:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #555;">${new Date(booking.checkIn).toLocaleDateString()} (After 2:00 PM)</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><strong style="color: #333;">Check-out:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #555;">${new Date(booking.checkOut).toLocaleDateString()} (Before 11:00 AM)</td>
                  </tr>
                </table>
                
                <div style="margin-top: 25px; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
                  <p style="font-size: 14px; color: #666666; margin: 0 0 10px 0;"><strong style="color: #333;">Arrival Instructions:</strong></p>
                  <p style="font-size: 14px; color: #555555; margin: 0 0 5px 0;">📍 ${businessConfig.address}</p>
                  <p style="font-size: 14px; color: #555555; margin: 0 0 15px 0;">📞 ${businessConfig.whatsappNumber}</p>
                  <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessConfig.name + ' ' + businessConfig.address)}" target="_blank" style="display: inline-block; background-color: #4285F4; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-size: 13px; font-weight: bold;">View on Google Maps 🗺️</a>
                </div>
                
                <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-top: 25px;">If you have any questions or need to make changes, please let us know.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                  <p style="font-size: 14px; color: #888888; margin: 0;">Safe travels,<br><strong style="color: #2C5234;">The ${businessConfig.name} Team</strong></p>
                </div>
              </div>
            </div>
          `,
        });

        // Mark as sent
        await prisma.booking.update({
          where: { id: booking.id },
          data: { reminderSent: true }
        });
        
        sentCount++;
      } catch (e) {
        console.error(`Failed to send reminder for booking ${booking.id}`, e);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully sent ${sentCount} reminder(s).` 
    });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
