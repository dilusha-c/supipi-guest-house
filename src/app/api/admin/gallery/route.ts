import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { supabaseAdmin } from '@/lib/supabase-admin';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET all gallery images
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Gallery Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

// POST upload new image
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('gallery')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return NextResponse.json({ error: "Failed to upload to storage" }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('gallery')
      .getPublicUrl(fileName);

    // Save to Database
    const currentCount = await prisma.galleryImage.count();
    const image = await prisma.galleryImage.create({
      data: {
        url: publicUrl,
        caption: caption || "",
        order: currentCount // put at the end
      }
    });

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error("Gallery Upload Error:", error);
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
  }
}

// DELETE image
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

    const image = await prisma.galleryImage.findUnique({ where: { id } });
    if (!image) return NextResponse.json({ error: "Image not found" }, { status: 404 });

    // Delete from Supabase Storage
    const fileName = image.url.split('/').pop();
    if (fileName) {
      await supabaseAdmin.storage.from('gallery').remove([fileName]);
    }

    // Delete from DB
    await prisma.galleryImage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}

// PUT bulk update images (order and caption)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { images } = await request.json();
    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Prisma doesn't have bulk upsert for different values, so we do it in a transaction
    await prisma.$transaction(
      images.map((img: any) => 
        prisma.galleryImage.update({
          where: { id: img.id },
          data: { 
            order: img.order,
            caption: img.caption || "" 
          }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery Bulk Update Error:", error);
    return NextResponse.json({ error: "Failed to update images" }, { status: 500 });
  }
}
