import { Reveal } from "@/components/ui/Reveal";
import { Divider, SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { event } from "@/config/event";

export function Parents() {
  if (event.parents.length === 0) return null;

  return (
    <SectionShell tone="paper" florals>
      <Reveal>
        <p className="mb-4 text-lg text-ink-soft italic">Con la bendición de</p>
        <SectionTitle top="Nuestros padres" />
      </Reveal>
      <Divider />
      <div className="space-y-10">
        {event.parents.map((group, index) => (
          <Reveal key={group.title} delay={150 * (index + 1)}>
            <h3 className="font-script text-3xl text-sage-dark">{group.title}</h3>
            <ul className="mt-3 space-y-1 text-xl">
              {group.names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
