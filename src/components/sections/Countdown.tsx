import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { Reveal } from "@/components/ui/Reveal";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { event } from "@/config/event";
import { formatEventDate } from "@/lib/dates";
import type { PublicGuest } from "@/lib/guest";

export function Countdown({ guest }: { guest: PublicGuest }) {
  return (
    <SectionShell florals>
      <Reveal className="mb-10">
        <p className="text-lg text-ink-soft italic">{guest.greeting}</p>
        <p className="mt-1 text-2xl">{guest.name}</p>
      </Reveal>

      <Reveal delay={150}>
        <SectionTitle top="Acompáñanos" script="a celebrar" bottom="nuestra boda" />
      </Reveal>

      <Reveal delay={300} className="mt-10">
        <div className="rounded-sm bg-cream px-5 py-8 shadow-[0_14px_30px_-14px_rgb(0_0_0/0.3)]">
          <p className="text-xl tracking-[0.15em] uppercase">{formatEventDate()}</p>
          <div className="mx-auto my-5 h-px w-full bg-ink/20" />
          <CountdownTimer target={event.date} />
        </div>
      </Reveal>
    </SectionShell>
  );
}
