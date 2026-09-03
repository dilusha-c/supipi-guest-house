import { NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for validating the incoming booking request
const bookingSchema = z.object({
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  adults: z.number().min(1, "At least 1 adult is required"),
  children: z.number().min(0).default(0),
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  specialRequests: z.string().max(500, "Request is too long").optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = bookingSchema.parse(body);
    
    // Ensure check-out is after check-in
    const checkInDate = new Date(validatedData.checkIn);
    const checkOutDate = new Date(validatedData.checkOut);
    
    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 }
      );
    }
    
    // In Phase 1, we do not have a live database connected. 
    // We simulate generating a Booking Reference and successfully receiving the request.
    
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // e.g., 20260903
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bookingReference = `SP-${dateStr}-${randomNum}`;
    
    // TODO: Phase 2 - Insert into PostgreSQL via Prisma
    /*
    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        guestName: validatedData.guestName,
        phone: validatedData.phone,
        email: validatedData.email || null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: validatedData.adults,
        children: validatedData.children,
        specialRequests: validatedData.specialRequests,
        status: 'PENDING',
      }
    });
    */
   
    // TODO: Phase 2 - Send Email Notification
    
    return NextResponse.json({
      success: true,
      message: "Booking request received successfully",
      bookingReference,
      data: {
        checkIn: validatedData.checkIn,
        checkOut: validatedData.checkOut,
        guestName: validatedData.guestName,
        adults: validatedData.adults,
        children: validatedData.children,
      }
    }, { status: 201 });
    
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
