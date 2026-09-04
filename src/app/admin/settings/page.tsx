import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import SettingsForm from "@/components/admin/SettingsForm";

const prisma = new PrismaClient();

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/123@supipiadmin-re/login");
  }

  let settings = await prisma.settings.findUnique({
    where: { id: "global" }
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: "global",
        basePrice: 50.0,
        hidePrice: false
      }
    });
  }

  return (
    <div className="pb-10">
      <h1 className="text-3xl font-heading text-forest mb-8">Settings & Pricing</h1>
      <SettingsForm initialSettings={{ basePrice: settings.basePrice, hidePrice: settings.hidePrice }} />
    </div>
  );
}
