import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { event } from "@/config/event";

export function Itinerary() {
  if (event.itinerary.length === 0) return null;

  return (
    <SectionShell tone="taupe" florals>
      <Reveal>
        <SectionTitle top="Itinerario" />
      </Reveal>

      <div className="relative mx-auto mt-12 max-w-sm">
        <span className="absolute top-10 bottom-10 left-1/2 w-px -translate-x-1/2 bg-ink/30" aria-hidden="true" />
        <ol className="relative">
          {event.itinerary.map((item, index) => {
            // Alternate sides like a zig-zag timeline: first entry on the right.
            const textOnLeft = index % 2 === 1;
            const text = (
              <div>
                <p className="text-xl">{item.time}</p>
                <p className="tracking-[0.12em] uppercase">{item.label}</p>
              </div>
            );
            return (
              <li key={`${item.time}-${item.label}`}>
                <Reveal delay={100 * index} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-5">
                  <div className="text-right">{textOnLeft && text}</div>
                  <span className="flex size-16 items-center justify-center rounded-full border border-ink/40 bg-taupe">
                    <Icon name={item.icon} className="size-10 text-ink" />
                  </span>
                  <div className="text-left">{!textOnLeft && text}</div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionShell>
  );
}
