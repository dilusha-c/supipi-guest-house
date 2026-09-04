import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import GalleryManager from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/123@supipiadmin-re/login");
  }

  return (
    <div className="pb-10">
      <GalleryManager />
    </div>
  );
}
