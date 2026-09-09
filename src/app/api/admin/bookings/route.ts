import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { businessConfig } from '@/config/business';
import { escapeHtml } from '@/lib/utils';

export const dynamic = 'force-dynamic';

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

    const { id, status, price, reason, customMessage } = await request.json();

    if (!id || !['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status or missing ID" }, { status: 400 });
    }

    // Retrieve the target booking first
    const targetBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!targetBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // If changing to CONFIRMED, check for conflicting confirmed bookings
    if (status === 'CONFIRMED') {
      const conflict = await prisma.booking.findFirst({
        where: {
          id: { not: id },
          status: 'CONFIRMED',
          checkIn: {
            lt: targetBooking.checkOut
          },
          checkOut: {
            gt: targetBooking.checkIn
          }
        }
      });

      if (conflict) {
        return NextResponse.json({
          error: `Cannot confirm: Dates conflict with another confirmed booking (${conflict.bookingReference}: ${conflict.guestName}).`
        }, { status: 409 });
      }
    }

    let numericPrice: number | undefined = undefined;
    if (price && typeof price === 'string') {
      const parsed = parseFloat(price.replace(/[^0-9.]/g, ''));
      if (!isNaN(parsed) && Number.isFinite(parsed) && parsed >= 0) numericPrice = parsed;
    } else if (typeof price === 'number' && Number.isFinite(price) && price >= 0) {
      numericPrice = price;
    }

    const dataToUpdate: any = { status };
    if (status === 'CONFIRMED' && numericPrice !== undefined) {
      dataToUpdate.totalPrice = numericPrice;
    }

    // Update database
    const booking = await prisma.booking.update({
      where: { id },
      data: dataToUpdate,
    });

    // Sanitized values for HTML emails
    const safeGuest = escapeHtml(booking.guestName);
    const safeRef = escapeHtml(booking.bookingReference);
    const safeReason = escapeHtml(reason || '');
    const safeCustomMessage = escapeHtml(customMessage || '');
    const safePrice = numericPrice !== undefined ? escapeHtml(`LKR ${numericPrice.toLocaleString()}`) : escapeHtml(price || '');

    // If accepted, send email
    if (status === 'CONFIRMED' && booking.email) {
      try {
        await sendEmail({
          to: booking.email,
          subject: 'Booking Confirmed - Supipi Guest House',
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; border-radius: 8px;">
              <div style="background-color: #2C5234; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 1px;">Booking Confirmed!</h1>
                <p style="color: #e0e7e3; margin: 10px 0 0 0; font-size: 16px;">${businessConfig.name}</p>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 0;">Dear <strong>${safeGuest}</strong>,</p>
                <p style="font-size: 16px; color: #555555; line-height: 1.6;">We are delighted to confirm your booking request at ${businessConfig.name}.</p>
                
                <div style="background-color: #f9fbf9; border: 1px solid #e2ece5; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center;">
                  <p style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Booking Reference</p>
                  <p style="font-size: 24px; color: #2C5234; font-weight: bold; letter-spacing: 2px; margin: 0;">${safeRef}</p>
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
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #333;">Guests:</strong></td>
                    <td style="padding: 10px 0; text-align: right; color: #555;">${booking.adults} Adults, ${booking.children} Children</td>
                  </tr>
                  ${numericPrice !== undefined ? `
                  <tr>
                    <td style="padding: 10px 0; border-top: 1px solid #eeeeee;"><strong style="color: #333;">Total Price:</strong></td>
                    <td style="padding: 10px 0; border-top: 1px solid #eeeeee; text-align: right; color: #2C5234; font-weight: bold; font-size: 18px;">${safePrice}</td>
                  </tr>
                  ` : ''}
                </table>
                
                ${safeCustomMessage ? `
                <div style="margin-top: 25px; padding: 15px; background-color: #eef5f0; border-left: 4px solid #2C5234; border-radius: 4px;">
                  <p style="font-size: 14px; color: #2C5234; margin: 0 0 5px 0;"><strong>Message from Supipi Guest House:</strong></p>
                  <p style="font-size: 15px; color: #333333; margin: 0; line-height: 1.5;">${safeCustomMessage}</p>
                </div>
                ` : ''}
                
                <div style="margin-top: 25px; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
                  <p style="font-size: 14px; color: #666666; margin: 0 0 10px 0;"><strong style="color: #333;">Arrival Instructions:</strong></p>
                  <p style="font-size: 14px; color: #555555; margin: 0 0 5px 0;">📍 ${businessConfig.address}</p>
                  <p style="font-size: 14px; color: #555555; margin: 0 0 15px 0;">📞 ${businessConfig.whatsappNumber}</p>
                  <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessConfig.name + ' ' + businessConfig.address)}" target="_blank" style="display: inline-block; background-color: #4285F4; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-size: 13px; font-weight: bold;">View on Google Maps 🗺️</a>
                </div>
                
                <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-top: 25px;">If you have any questions before your arrival, please contact us!</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                  <p style="font-size: 14px; color: #888888; margin: 0;">Warm regards,<br><strong style="color: #2C5234;">The ${businessConfig.name} Team</strong></p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    } else if (status === 'REJECTED' && booking.email) {
      try {
        await sendEmail({
          to: booking.email,
          subject: 'Booking Request Declined - Supipi Guest House',
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; border-radius: 8px;">
              <div style="background-color: #8B0000; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Booking Declined</h1>
              </div>
              <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 0;">Dear <strong>${safeGuest}</strong>,</p>
                <p style="font-size: 16px; color: #555555; line-height: 1.6;">Thank you for your request. Unfortunately, we are unable to accommodate your booking for the selected dates (${new Date(booking.checkIn).toLocaleDateString()} to ${new Date(booking.checkOut).toLocaleDateString()}).</p>
                
                ${safeReason ? `
                <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #8B0000; border-radius: 4px;">
                  <p style="font-size: 14px; color: #666666; margin: 0 0 5px 0;"><strong>Reason:</strong></p>
                  <p style="font-size: 15px; color: #333333; margin: 0;">${safeReason}</p>
                </div>
                ` : ''}
                
                ${safeCustomMessage ? `
                <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #333333; border-radius: 4px;">
                  <p style="font-size: 14px; color: #333333; margin: 0 0 5px 0;"><strong>Message from Supipi Guest House:</strong></p>
                  <p style="font-size: 15px; color: #333333; margin: 0; line-height: 1.5;">${safeCustomMessage}</p>
                </div>
                ` : ''}

                <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-top: 25px;">We sincerely apologize for the inconvenience and hope to have the opportunity to host you another time.</p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                  <p style="font-size: 14px; color: #888888; margin: 0;">Warm regards,<br><strong style="color: #333333;">The ${businessConfig.name} Team</strong></p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
      }
    } else if (status === 'CANCELLED' && booking.email) {
      try {
        await sendEmail({
          to: booking.email,
          subject: 'Booking Cancelled - Supipi Guest House',
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; border-radius: 8px;">
              <div style="background-color: #e53e3e; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Booking Cancelled</h1>
              </div>
              <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 0;">Dear <strong>${safeGuest}</strong>,</p>
                <p style="font-size: 16px; color: #555555; line-height: 1.6;">Your booking (Reference: <strong>${safeRef}</strong>) has been cancelled.</p>
                
                ${safeReason ? `
                <div style="margin-top: 20px; padding: 15px; background-color: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 4px;">
                  <p style="font-size: 14px; color: #e53e3e; margin: 0 0 5px 0;"><strong>Reason for Cancellation:</strong></p>
                  <p style="font-size: 15px; color: #333333; margin: 0;">${safeReason}</p>
                </div>
                ` : ''}
                
                ${safeCustomMessage ? `
                <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #333333; border-radius: 4px;">
                  <p style="font-size: 14px; color: #333333; margin: 0 0 5px 0;"><strong>Message from Supipi Guest House:</strong></p>
                  <p style="font-size: 15px; color: #333333; margin: 0; line-height: 1.5;">${safeCustomMessage}</p>
                </div>
                ` : ''}

                <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-top: 25px;">If you believe this is a mistake, or if you need to reschedule your stay, please contact us immediately.</p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                  <p style="font-size: 14px; color: #888888; margin: 0;">Warm regards,<br><strong style="color: #333333;">The ${businessConfig.name} Team</strong></p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send cancellation email:", emailError);
      }
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Admin Booking Update Error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
