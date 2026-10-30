import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { coupleNames, event } from "@/config/event";
import { formatShortDate } from "@/lib/dates";

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-between overflow-hidden text-cream">
      <Photo src={event.images.hero} alt={`Fotografía de ${coupleNames}`} eager sizes="100vw" />
      <div className="absolute inset-0 bg-linear-to-b from-ink/60 via-ink/5 to-ink/60" aria-hidden="true" />

      <Reveal className="relative z-10 pt-[16svh] text-center">
        <h1 className="font-script text-6xl leading-tight drop-shadow-lg sm:text-7xl">
          {event.couple.partner1}
          <span className="block text-4xl">&amp;</span>
          {event.couple.partner2}
        </h1>
      </Reveal>

      <Reveal delay={300} className="relative z-10 pb-[max(3rem,env(safe-area-inset-bottom))] text-center">
        <p className="font-sans text-sm tracking-[0.35em]">{formatShortDate()}</p>
        <span className="mt-6 block animate-bounce text-xl" aria-hidden="true">
          ↓
        </span>
      </Reveal>
    </section>
  );
}
