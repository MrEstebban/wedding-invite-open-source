import { Floral } from "@/components/ui/Floral";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionShell } from "@/components/ui/SectionShell";
import { coupleNames, event } from "@/config/event";

export function Quote() {
  return (
    <SectionShell tone="cream">
      <Reveal>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-4/5 overflow-hidden rounded-sm shadow-xl">
            <Photo src={event.images.quote} alt={`${coupleNames} juntos`} sizes="(min-width: 640px) 384px, 90vw" />
          </div>
          <Floral className="absolute -bottom-10 -left-10 w-32" />
        </div>
      </Reveal>

      <Reveal delay={150} className="mt-16">
        <blockquote className="text-xl leading-relaxed text-ink italic sm:text-2xl">
          <p>“{event.quote.text}”</p>
          {event.quote.author && (
            <footer className="mt-4 font-sans text-sm tracking-widest text-ink-soft not-italic">
              — {event.quote.author}
            </footer>
          )}
        </blockquote>
      </Reveal>
    </SectionShell>
  );
}
