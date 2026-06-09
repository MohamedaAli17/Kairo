import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "dark" | "accent" | "brand" | "ghost";

const variants: Record<Variant, string> = {
  dark: "bg-ink text-white hover:bg-black",
  accent: "bg-accent text-white hover:bg-accent-dark shadow-[0_10px_24px_-10px_rgba(244,88,42,0.7)]",
  brand: "bg-brand text-white hover:bg-brand-dark shadow-[0_10px_24px_-10px_rgba(244,88,42,0.7)]",
  ghost: "bg-transparent text-ink hover:bg-black/5",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "dark",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
