import { Reveal } from "@/components/ui/Reveal";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { event } from "@/config/event";

function GownFigure() {
  return (
    <svg viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-56 w-auto" aria-hidden="true">
      <circle cx="50" cy="20" r="9" />
      <path d="M44 14c-6 6-6 20-2 28M56 14c5 6 5 14 3 20" />
      <path d="M47 29v6M53 29v6" />
      <path d="M38 40c4-4 20-4 24 0l-3 26H41z" />
      <path d="M38 40l-7 26 4 6M62 40l7 26-4 6" />
      <path d="M41 66c-6 30-16 70-24 118h66c-8-48-18-88-24-118" />
      <path d="M48 72c-3 40-8 80-14 112M53 72c3 40 9 80 17 112" opacity="0.5" />
    </svg>
  );
}

function SuitFigure() {
  return (
    <svg viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-56 w-auto" aria-hidden="true">
      <circle cx="50" cy="20" r="9" />
      <path d="M41 16c2-8 16-8 18 0" />
      <path d="M46 29v6h8v-6" />
      <path d="M34 40l16-5 16 5 3 60H31z" />
      <path d="M50 35l-6 20 6 12 6-12z" />
      <path d="M48 38h4l-2 4z" />
      <path d="M34 40l-6 58M66 40l6 58" />
      <path d="M36 100l3 82h9l2-68 2 68h9l3-82" />
      <path d="M36 184h12M52 184h12" />
    </svg>
  );
}

export function DressCode() {
  const dressCode = event.dressCode;
  if (!dressCode) return null;

  return (
    <SectionShell tone="taupe">
      <Reveal>
        <SectionTitle top={dressCode.title} />
        <p className="mt-4 text-lg text-ink-soft italic">{dressCode.note}</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-6 text-ink">
        <Reveal delay={150}>
          <GownFigure />
          <p className="mt-4 text-lg">{dressCode.women}</p>
        </Reveal>
        <Reveal delay={300}>
          <SuitFigure />
          <p className="mt-4 text-lg">{dressCode.men}</p>
        </Reveal>
      </div>
    </SectionShell>
  );
}
