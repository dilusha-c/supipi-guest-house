import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { businessConfig } from "@/config/business";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      source, guestName, phone, email, 
      checkIn, checkOut, adults, children, price 
    } = body;

    if (!guestName || !phone || !checkIn || !checkOut || !adults) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomNum = Math.floor(100 + Math.random() * 900);
    const bookingReference = `SP-${dateStr}-${randomNum}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingReference,
        source: source || 'DIRECT',
        guestName,
        phone,
        email: email || '',
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        adults: parseInt(adults),
        children: parseInt(children || '0'),
        status: 'CONFIRMED', 
        totalPrice: price ? parseFloat(price) : null,
      }
    });

    // If an email is provided, send the Confirmation Email instantly
    if (email && email.trim() !== '') {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #2C5234; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Booking Confirmed!</h1>
            <p style="color: #e0e7e3; margin: 10px 0 0 0; font-size: 16px;">${businessConfig.name}</p>
          </div>
          
          <div style="padding: 30px 20px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 0;">Dear <strong>${guestName}</strong>,</p>
            <p style="font-size: 16px; color: #555555; line-height: 1.6;">Your booking at ${businessConfig.name} has been manually confirmed by our staff.</p>
            
            <div style="background-color: #f8faf9; border-left: 4px solid #4A7C59; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <p style="font-size: 14px; color: #666666; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px;">Booking Reference</p>
              <p style="font-size: 24px; color: #2C5234; font-weight: bold; letter-spacing: 2px; margin: 0;">${bookingReference}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tbody>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #888888; width: 40%;">Check-in:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #555;">${new Date(checkIn).toLocaleDateString()} (After 2:00 PM)</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #888888;">Check-out:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #555;">${new Date(checkOut).toLocaleDateString()} (Before 11:00 AM)</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #888888;">Guests:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #555;">${adults} Adults, ${children || 0} Children</td>
                </tr>
                ${price ? `
                <tr>
                  <td style="padding: 10px 0; border-top: 1px solid #eeeeee; color: #2C5234; font-weight: bold; font-size: 16px;">Total Price:</td>
                  <td style="padding: 10px 0; border-top: 1px solid #eeeeee; text-align: right; color: #2C5234; font-weight: bold; font-size: 18px;">LKR ${price}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
          
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="font-size: 13px; color: #888888; margin: 0 0 10px 0;">Need to make changes?</p>
            <p style="font-size: 13px; color: #888888; margin: 0;">Contact us at <strong style="color: #555;">${businessConfig.whatsappNumber}</strong></p>
          </div>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: `Booking Confirmed - ${bookingReference}`,
        html: emailHtml
      });
    }

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("Admin Add Booking Error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
