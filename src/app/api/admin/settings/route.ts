import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.settings.findUnique({
      where: { id: 'global' }
    });

    // Seed if it doesn't exist yet
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 'global',
          basePrice: 50.0,
          hidePrice: false
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Admin Settings Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { basePrice, hidePrice } = await request.json();

    const settings = await prisma.settings.upsert({
      where: { id: 'global' },
      update: {
        ...(basePrice !== undefined && { basePrice: Number(basePrice) }),
        ...(hidePrice !== undefined && { hidePrice: Boolean(hidePrice) }),
      },
      create: {
        id: 'global',
        basePrice: Number(basePrice) || 50.0,
        hidePrice: Boolean(hidePrice) || false,
      }
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Admin Settings Update Error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
