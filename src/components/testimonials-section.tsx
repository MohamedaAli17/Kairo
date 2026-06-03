"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: "sarah",
    name: "Sarah Mitchell",
    role: "CS Student, Internship Candidate",
    rating: 5,
    quote:
      "Kairo made interviews feel easier because I practiced real sprint pressure, PR comments, and standups before applying.",
    avatar: "https://i.pravatar.cc/120?img=36",
  },
  {
    id: "ibrahim",
    name: "Ibrahim Noor",
    role: "Junior Backend Developer",
    rating: 5,
    quote:
      "The incident simulation mode helped me stay calm under pressure and communicate clearly when things break.",
    avatar: "https://i.pravatar.cc/120?img=15",
  },
  {
    id: "maria",
    name: "Maria Chen",
    role: "Bootcamp Graduate",
    rating: 5,
    quote:
      "I finally understood what real teamwork feels like. The PM and QA feedback felt like an actual job environment.",
    avatar: "https://i.pravatar.cc/120?img=32",
  },
  {
    id: "zayd",
    name: "Zayd Ali",
    role: "Frontend Intern",
    rating: 5,
    quote:
      "Before Kairo, I only solved coding tasks. Now I can explain trade-offs, raise blockers, and respond to review comments well.",
    avatar: "https://i.pravatar.cc/120?img=11",
  },
  {
    id: "ruth",
    name: "Ruth Johnson",
    role: "University Student",
    rating: 5,
    quote:
      "The standup and planning meetings gave me confidence to speak clearly about my progress in interviews.",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
];

function getWrappedIndex(index: number) {
  const total = testimonials.length;
  return ((index % total) + total) % total;
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const active = testimonials[activeIndex];
  const leftCard = testimonials[getWrappedIndex(activeIndex - 1)];
  const rightCard = testimonials[getWrappedIndex(activeIndex + 1)];

  const goPrev = () => setActiveIndex((prev) => getWrappedIndex(prev - 1));
  const goNext = () => setActiveIndex((prev) => getWrappedIndex(prev + 1));

  return (
    <motion.section
      id="testimonials"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-screen snap-start items-center px-3 pb-10 pt-24 md:px-4"
    >
      <div className="relative mx-auto flex min-h-[88vh] w-full max-w-[1500px] flex-col items-center overflow-hidden rounded-[2rem] border border-black/5 bg-white/62 px-6 pt-14 shadow-soft">
        <h3 className="text-center text-5xl font-bold leading-tight tracking-tight text-ink md:text-7xl">
          Words of Appreciation
        </h3>
        <p className="mt-3 text-center text-[20px] text-muted">
          From students and junior engineers leveling up with Kairo.
        </p>

        <div className="relative mt-10 w-full max-w-[1220px]">
          <div className="absolute left-0 top-8 hidden h-[340px] w-[30%] rounded-3xl border border-black/5 bg-white/80 p-6 text-left shadow-soft lg:block rotate-12">
            <p className="text-2xl font-semibold tracking-tight text-ink">{leftCard.name}</p>
            <p className="mt-1 text-sm text-muted">{leftCard.role}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">“{leftCard.quote}”</p>
          </div>
          <div className="absolute right-0 top-8 hidden h-[340px] w-[30%] rounded-3xl border border-black/5 bg-white/80 p-6 text-left shadow-soft lg:block -rotate-12">
            <p className="text-2xl font-semibold tracking-tight text-ink">{rightCard.name}</p>
            <p className="mt-1 text-sm text-muted">{rightCard.role}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">“{rightCard.quote}”</p>
          </div>

          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative mx-auto mt-6 w-full max-w-[430px] rounded-3xl border border-black/5 bg-white p-8 text-center shadow-soft"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.avatar}
              alt={active.name}
              className="mx-auto h-16 w-16 rounded-2xl object-cover"
            />
            <p className="mt-5 text-4xl font-semibold tracking-tight text-ink">
              {active.name}
            </p>
            <p className="mt-2 text-[18px] text-muted">{active.role}</p>
            <div className="mt-5 flex items-center justify-center gap-1 text-amber-400">
              {Array.from({ length: active.rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
              <span className="ml-2 text-sm text-ink">{active.rating.toFixed(1)}</span>
            </div>
            <p className="mt-5 text-[18px] leading-relaxed text-muted">“{active.quote}”</p>
          </motion.div>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-muted transition hover:text-ink"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonial"
            className="grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-muted transition hover:text-ink"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
