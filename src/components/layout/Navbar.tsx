"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Rooms", href: "/rooms" },
  { name: "Gallery", href: "/gallery" },
  { name: "Facilities", href: "/facilities" },
  { name: "Location", href: "/location" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
    {
      "bg-cream/95 backdrop-blur-sm shadow-sm text-dark py-4": isScrolled || !isHomePage,
      "bg-transparent text-white py-6": !isScrolled && isHomePage,
    }
  );

  return (
    <header className={navClass}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start leading-none group">
          <span className="font-heading font-bold text-xl tracking-wider uppercase group-hover:text-forest/80 transition-colors">
            SUPIPI
          </span>
          <span className="text-xs tracking-widest uppercase mt-1">
            GUEST HOUSE
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium hover:text-forest transition-colors",
                pathname === link.href && (!isHomePage || isScrolled)
                  ? "text-forest font-semibold"
                  : ""
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/booking" className="btn-primary py-2 px-5 text-sm ml-4">
            Book Now
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-cream text-dark border-b border-light-border shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "block text-lg py-2 border-b border-light-border/50",
                  pathname === link.href ? "text-forest font-semibold" : ""
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/booking"
              className="btn-primary w-full text-center mt-4"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
