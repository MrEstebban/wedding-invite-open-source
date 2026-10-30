import { Reveal } from "@/components/ui/Reveal";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { event } from "@/config/event";

export function NoKids() {
  const noKids = event.noKids;
  if (!noKids) return null;

  return (
    <SectionShell tone="paper" tall={false}>
      <Reveal>
        <SectionTitle top={noKids.title} />
        <p className="mx-auto mt-6 max-w-sm text-xl leading-relaxed text-ink-soft">{noKids.text}</p>
      </Reveal>
    </SectionShell>
  );
}
