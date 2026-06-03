"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface NavLinkItem {
  label: string;
  targetId?: string;
  href?: string;
}

const links = [
  { label: "Product", targetId: "hero" },
  { label: "How it works", targetId: "workflows" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", targetId: "resources" },
] satisfies NavLinkItem[];

export function Navbar() {
  const goToSection = (targetId: string) => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.assign(`/#${targetId}`);
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border border-black/5 bg-white/90 px-3 py-2 shadow-pill backdrop-blur-md">
        <button
          type="button"
          onClick={() => goToSection("hero")}
          className="flex items-center gap-2 pl-2"
        >
          <span className="relative h-6 w-6 overflow-hidden rounded-md">
            <Image
              src="/brand/kairo-logo.png"
              alt="Kairo logo"
              fill
              className="object-cover"
            />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            Kairo
          </span>
        </button>

        <ul className="hidden items-center gap-6 text-sm text-muted md:flex">
          {links.map((link) => (
            <li key={link.label}>
              {link.href ? (
                <a href={link.href} className="transition-colors hover:text-ink">
                  {link.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => goToSection(link.targetId!)}
                  className="transition-colors hover:text-ink"
                >
                  {link.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            className="hidden sm:inline-flex"
            onClick={() => window.location.assign("/login")}
          >
            Log in
          </Button>
          <Button variant="dark" onClick={() => window.location.assign("/signup")}>
            Start Simulation
          </Button>
        </div>
      </nav>
    </motion.header>
  );
}
