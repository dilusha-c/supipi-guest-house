import Link from "next/link";
import { cn } from "@/lib/utils";

interface BookingCTAProps {
  className?: string;
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
}

export default function BookingCTA({
  className,
  variant = "primary",
  children = "Book Now",
}: BookingCTAProps) {
  return (
    <Link
      href="/booking"
      className={cn(
        variant === "primary" ? "btn-primary" : "btn-secondary",
        className
      )}
    >
      {children}
    </Link>
  );
}
