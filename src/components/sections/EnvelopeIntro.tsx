"use client";

import { useEffect, useState } from "react";
import { useMusic } from "@/components/music/MusicProvider";
import { Floral } from "@/components/ui/Floral";
import { event } from "@/config/event";
import { peopleLabel, type PublicGuest } from "@/lib/guest";

type Phase = "closed" | "opening" | "gone";

const OPEN_DURATION_MS = 1900;

/**
 * Full-screen sealed envelope addressed to the guest. Opening it is the user
 * gesture that mobile browsers require to start the background music.
 */
export function EnvelopeIntro({ guest }: { guest: PublicGuest }) {
  const { play } = useMusic();
  const [phase, setPhase] = useState<Phase>("closed");
  const visible = phase !== "gone";

  // Keep the page from scrolling behind the envelope.
  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [visible]);

  function open() {
    if (phase !== "closed") return;
    play();
    window.scrollTo(0, 0);
    setPhase("opening");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => setPhase("gone"), reducedMotion ? 50 : OPEN_DURATION_MS);
  }

  if (!visible) return null;

  const initials = `${event.couple.partner1[0]}&${event.couple.partner2[0]}`;

  return (
    <div className="envelope fixed inset-0 z-40" data-phase={phase}>
      <button
        type="button"
        onClick={open}
        aria-label={`Abrir la invitación de ${guest.name}`}
        className="relative block h-full w-full cursor-pointer overflow-hidden bg-[#e4dcef] text-ink"
      >
        <span className="envelope-flap envelope-flap-left bg-[#ddd3ea]" />
        <span className="envelope-flap envelope-flap-right bg-[#ddd3ea]" />
        <span className="envelope-flap envelope-flap-bottom bg-[#e9e2f3]" />
        <span className="envelope-flap envelope-flap-top bg-[#f1ecf8]" />

        <Floral className="pointer-events-none absolute top-0 left-0 z-10 w-44 sm:w-60" />
        <Floral className="pointer-events-none absolute right-0 bottom-0 z-10 w-44 rotate-180 sm:w-60" />

        <span className="wax-seal absolute top-[52%] left-1/2 z-10 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-script text-3xl text-[#f3ecfb] sm:size-28">
          {initials}
        </span>

        <span className="absolute inset-x-0 bottom-[22%] z-10 block px-6 text-center">
          <span className="block font-serif text-2xl sm:text-3xl">{guest.name}</span>
          <span className="mt-2 block font-serif text-lg capitalize">{peopleLabel(guest.maxGuests)}</span>
          <span className="mt-8 block animate-pulse font-sans text-xs tracking-[0.3em] uppercase opacity-80">
            Toca para abrir
          </span>
        </span>
      </button>
    </div>
  );
}
