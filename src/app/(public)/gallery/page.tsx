import { PrismaClient } from "@prisma/client";
import GalleryView from "@/components/gallery/GalleryView";

const prisma = new PrismaClient();

export const revalidate = 3600; // Cache for 1 hour

export default async function GalleryPage() {
  // Fetch images from the database in order
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: 'asc' }
  });

  return <GalleryView images={images} />;
}
