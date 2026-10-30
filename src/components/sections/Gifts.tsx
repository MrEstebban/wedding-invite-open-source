import { CopyButton } from "@/components/ui/CopyButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { event } from "@/config/event";

export function Gifts() {
  const gifts = event.gifts;
  if (!gifts) return null;

  return (
    <SectionShell tone="cream" florals>
      <Reveal>
        <SectionTitle top={gifts.title} />
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">{gifts.text}</p>
      </Reveal>

      <div className="mt-10 space-y-6">
        {gifts.accounts.map((account, index) => (
          <Reveal key={account.number} delay={150 * (index + 1)}>
            <div className="rounded-sm bg-paper px-6 py-6 shadow-[0_14px_30px_-14px_rgb(0_0_0/0.3)]">
              <p className="font-sans text-xs tracking-[0.25em] text-ink-soft uppercase">{account.bank}</p>
              <p className="mt-2 text-xl">{account.holder}</p>
              <p className="mt-1 text-lg tabular-nums">Cuenta: {account.number}</p>
              <div className="mt-4">
                <CopyButton value={account.number} label="Copiar número" />
              </div>
            </div>
          </Reveal>
        ))}

        {gifts.registries.map((registry) => (
          <Reveal key={registry.url}>
            <a
              href={registry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-paper px-8 py-3 font-sans text-sm text-ink shadow-md ring-1 ring-ink/5 transition hover:-translate-y-0.5"
            >
              {registry.label}
            </a>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
