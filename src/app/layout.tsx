import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { businessConfig } from "@/config/business";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileContactBar from "@/components/layout/MobileContactBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${businessConfig.name} | Comfortable Stay in Haputale, Sri Lanka`,
  description: businessConfig.description,
  openGraph: {
    title: `${businessConfig.name} | Haputale, Sri Lanka`,
    description: businessConfig.description,
    siteName: businessConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: businessConfig.name,
    image: "/images/mountain-view.jpg",
    description: businessConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessConfig.address,
      addressLocality: businessConfig.city,
      addressRegion: "Uva Province",
      addressCountry: businessConfig.country,
    },
    telephone: businessConfig.phone,
    url: "https://supipiguesthouse.com", // update with actual URL when known
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col pb-16 md:pb-0`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <MobileContactBar />
      </body>
    </html>
  );
}
