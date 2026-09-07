import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import GalleryView from "@/components/gallery/GalleryView";

export const metadata: Metadata = {
  title: "Gallery | Supipi Guest House",
  description: "Browse photos of Supipi Guest House, our comfortable rooms, facilities, and the beautiful scenery of Haputale, Sri Lanka.",
};

export const revalidate = 3600; // Cache for 1 hour

export default async function GalleryPage() {
  // Fetch images from the database in order
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: 'asc' }
  });

  return <GalleryView images={images} />;
}
