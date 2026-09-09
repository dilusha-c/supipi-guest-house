import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { escapeHtml } from '@/lib/utils';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Zod schema for validating the incoming booking request
const bookingSchema = z.object({
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid check-in date" }),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid check-out date" }),
  adults: z.number().int().min(1, "At least 1 adult is required"),
  children: z.number().int().min(0).default(0),
  guestName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: z.string().trim().min(8, "Valid phone number required").max(30, "Phone number is too long"),
  email: z.string().trim().email("Valid email is required").max(100, "Email is too long"),
  specialRequests: z.string().trim().max(500, "Request is too long").optional(),
});

// Helper to generate a unique booking reference with high entropy
function generateReference(): string {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase(); // 4 alphanumeric hex chars
  return `SP-${dateStr}-${randomSuffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = bookingSchema.parse(body);
    
    // Ensure dates are parsed at UTC midnight / valid boundary
    const checkInDate = new Date(validatedData.checkIn);
    const checkOutDate = new Date(validatedData.checkOut);
    
    // 1. Ensure check-out is strictly after check-in
    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 }
      );
    }

    // 2. Ensure check-in is not in the past
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const checkInStart = new Date(checkInDate);
    checkInStart.setHours(0, 0, 0, 0);
    
    if (checkInStart < startOfToday) {
      return NextResponse.json(
        { error: "Check-in date cannot be in the past" },
        { status: 400 }
      );
    }
    
    // 3. CRITICAL: Server-Side Double Booking Check
    // A booking conflicts if an existing confirmed booking satisfies:
    // existing.checkIn < newCheckOut AND existing.checkOut > newCheckIn
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        status: 'CONFIRMED',
        checkIn: {
          lt: checkOutDate
        },
        checkOut: {
          gt: checkInDate
        }
      }
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { 
          error: "The requested dates are no longer available. Please select different dates.",
          conflict: true 
        },
        { status: 409 }
      );
    }
    
    // 4. Collision-Resistant Booking Creation
    let booking;
    let attempts = 0;
    while (!booking && attempts < 3) {
      attempts++;
      const bookingReference = generateReference();
      try {
        booking = await prisma.booking.create({
          data: {
            bookingReference,
            guestName: validatedData.guestName,
            phone: validatedData.phone,
            email: validatedData.email,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            adults: validatedData.adults,
            children: validatedData.children,
            specialRequests: validatedData.specialRequests,
            status: 'PENDING',
          }
        });
      } catch (dbErr: any) {
        // Retry if unique reference collision (Prisma code P2002)
        if (dbErr.code === 'P2002' && attempts < 3) {
          continue;
        }
        throw dbErr;
      }
    }

    if (!booking) {
      return NextResponse.json({ error: "Failed to generate unique booking reference" }, { status: 500 });
    }

    // Safe escaped strings for HTML emails
    const safeRef = escapeHtml(booking.bookingReference);
    const safeGuest = escapeHtml(booking.guestName);
    const safePhone = escapeHtml(booking.phone);
    const safeEmail = escapeHtml(booking.email);
    const safeRequests = escapeHtml(booking.specialRequests || 'None');
    const safeCheckIn = escapeHtml(booking.checkIn.toLocaleDateString());
    const safeCheckOut = escapeHtml(booking.checkOut.toLocaleDateString());
   
    // Send Email Notifications to Admin
    const adminEmails = Array.from(
      new Set(
        [
          process.env.ADMIN_EMAIL || 'supipiguesthouse@gmail.com',
          'dilushachamika@gmail.com',
        ].filter(Boolean) as string[]
      )
    );

    try {
      // 1. Alert Admin
      await sendEmail({
        to: adminEmails,
        subject: `New Booking Request: ${booking.bookingReference}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; border-radius: 8px;">
            <div style="background-color: #2C5234; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">New Booking Request</h1>
            </div>
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <p style="font-size: 16px; color: #333333; line-height: 1.5; margin-top: 0;">You have received a new booking request for Supipi Guest House.</p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;"><strong>Booking Ref:</strong> <span style="color: #2C5234; font-size: 16px;">${safeRef}</span></p>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;"><strong>Guest:</strong> <span style="color: #333;">${safeGuest}</span></p>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;"><strong>Dates:</strong> <span style="color: #333;">${safeCheckIn} — ${safeCheckOut}</span></p>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;"><strong>Guests:</strong> <span style="color: #333;">${booking.adults} Adults, ${booking.children} Children</span></p>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;"><strong>Contact:</strong> <span style="color: #333;">${safePhone} ${booking.email ? `| ${safeEmail}` : ''}</span></p>
              </div>

              <div style="margin-top: 20px;">
                <p style="font-size: 14px; color: #666666; margin-bottom: 5px;"><strong>Special Requests:</strong></p>
                <p style="font-size: 14px; color: #333333; background-color: #f1f1f1; padding: 10px; border-radius: 4px; margin-top: 0;">${safeRequests}</p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL}/123@supipiadmin-re" style="background-color: #2C5234; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; display: inline-block;">Manage Booking</a>
              </div>
            </div>
          </div>
        `
      });

      // 2. Email Guest
      if (booking.email) {
        await sendEmail({
          to: booking.email,
          subject: `Booking Request Received - ${booking.bookingReference}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; border-radius: 8px;">
              <div style="background-color: #2C5234; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 1px;">Request Received!</h1>
                <p style="color: #e0e7e3; margin: 10px 0 0 0; font-size: 16px;">Supipi Guest House</p>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 0;">Dear <strong>${safeGuest}</strong>,</p>
                <p style="font-size: 16px; color: #555555; line-height: 1.6;">Thank you for choosing Supipi Guest House! We have successfully received your booking request.</p>
                
                <div style="background-color: #f9fbf9; border: 1px solid #e2ece5; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center;">
                  <p style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Booking Reference</p>
                  <p style="font-size: 24px; color: #2C5234; font-weight: bold; letter-spacing: 2px; margin: 0;">${safeRef}</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><strong style="color: #333;">Check-in:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #555;">${safeCheckIn}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><strong style="color: #333;">Check-out:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #555;">${safeCheckOut}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #333;">Guests:</strong></td>
                    <td style="padding: 10px 0; text-align: right; color: #555;">${booking.adults} Adults, ${booking.children} Children</td>
                  </tr>
                </table>
                
                <p style="font-size: 15px; color: #555555; line-height: 1.6;">We are currently reviewing your request. We will contact you shortly at <strong>${safePhone}</strong> to confirm availability and finalize your booking.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                  <p style="font-size: 14px; color: #888888; margin: 0;">Warm regards,<br><strong style="color: #2C5234;">The Supipi Guest House Team</strong></p>
                </div>
              </div>
            </div>
          `
        });
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }
    
    return NextResponse.json({
      success: true,
      message: "Booking request received successfully",
      bookingReference: booking.bookingReference,
      data: booking
    }, { status: 201 });
    
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
