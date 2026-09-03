import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "left",
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-16",
        {
          "text-left": align === "left",
          "text-center": align === "center",
          "text-right": align === "right",
        },
        className
      )}
    >
      {subtitle && (
        <span
          className={cn(
            "block text-sm font-semibold tracking-widest uppercase mb-3",
            light ? "text-cream/80" : "text-sage"
          )}
        >
          {subtitle}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-[44px] font-heading font-medium leading-tight",
          light ? "text-white" : "text-forest"
        )}
      >
        {title}
      </h2>
    </div>
  );
}
