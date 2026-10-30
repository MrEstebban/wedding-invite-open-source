import { Reveal } from "@/components/ui/Reveal";
import { RsvpForm } from "@/components/sections/RsvpForm";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { formatDeadline, isRsvpOpen } from "@/lib/dates";
import type { PublicGuest } from "@/lib/guest";

export function Rsvp({ token, guest }: { token: string; guest: PublicGuest }) {
  return (
    <SectionShell id="rsvp" tone="paper" florals>
      <div className="rounded-sm bg-cream/95 px-5 py-12 shadow-xl sm:px-8">
        <Reveal>
          <SectionTitle top="Confirma" script="tu" bottom="asistencia" />
        </Reveal>
        <Reveal delay={150}>
          <RsvpForm token={token} guest={guest} open={isRsvpOpen()} deadline={formatDeadline()} />
        </Reveal>
      </div>
    </SectionShell>
  );
}
