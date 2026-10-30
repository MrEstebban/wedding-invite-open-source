import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionShell } from "@/components/ui/SectionShell";
import { event } from "@/config/event";

/** One full-height section per venue (ceremony, reception, ...). */
export function Venues() {
  return event.venues.map((venue, index) => (
    <SectionShell key={venue.title} tone={index % 2 === 0 ? "paper" : "cream"}>
      <Reveal>
        <Icon name={venue.icon} className="mx-auto size-20 text-ink" />
        <p className="mt-6 text-2xl">{venue.time}</p>
        <h2 className="mt-2 text-4xl font-medium tracking-[0.12em] uppercase">{venue.title}</h2>
      </Reveal>
      <Reveal delay={150}>
        <p className="mt-6 text-xl tracking-[0.1em] uppercase">{venue.place}</p>
        <p className="mx-auto mt-3 max-w-xs text-lg text-ink-soft">{venue.address}</p>
        <a
          href={venue.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-md bg-cream px-12 py-3 font-sans text-sm text-ink shadow-md ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Ver mapa
        </a>
      </Reveal>
    </SectionShell>
  ));
}
