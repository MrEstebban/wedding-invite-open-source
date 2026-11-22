import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { event } from "@/config/event";

function SuitFigure() {
  return (
    <svg viewBox="0 0 100 230" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-64 w-auto" aria-hidden="true">
      <ellipse cx="50" cy="20" rx="8" ry="10" />
      <path d="M43 15c2-7 12-7 14 0" />
      <path d="M46 29v6M54 29v6" />
      <path d="M33 42l17-6 17 6 3 68H30z" />
      <path d="M50 36l-7 22 7 14 7-14z" />
      <path d="M48 40h4l-1 4h-2z" />
      <path d="M49 44l-1.5 16 2.5 4 2.5-4-1.5-16" />
      <path d="M33 42l-6 64M67 42l6 64" />
      <path d="M36 110l3 104h9l2-84 2 84h9l3-104" />
      <path d="M37 216h12M51 216h12" />
    </svg>
  );
}

export function DressCode() {
  const dressCode = event.dressCode;
  if (!dressCode) return null;

  return (
    <SectionShell tone="lilac">
      <Reveal>
        <SectionTitle top={dressCode.title} />
        <p className="mt-4 text-lg text-ink italic">{dressCode.note}</p>
      </Reveal>

      <Reveal delay={100} className="mt-8">
        <h3 className="font-sans text-xs tracking-[0.25em] text-ink uppercase">Colores reservados</h3>
        <ul className="mt-4 flex justify-center gap-2" aria-label="Morados y amarillos">
          {dressCode.reservedColors.swatches.map((color) => (
            <li key={color} className="size-8 rounded-full ring-1 ring-ink/15" style={{ backgroundColor: color }} />
          ))}
        </ul>
        <p className="mx-auto mt-4 max-w-xs text-lg text-ink-soft">{dressCode.reservedColors.text}</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 items-end gap-6 text-ink">
        <Reveal delay={150}>
          <Image
            src={dressCode.women.image}
            alt="Ilustración de un vestido de cóctel"
            width={345}
            height={800}
            sizes="140px"
            // The drawing has an off-white background; multiply blends it into the section.
            className="mx-auto h-64 w-auto mix-blend-multiply"
          />
          <p className="mt-4 text-lg">{dressCode.women.label}</p>
        </Reveal>
        <Reveal delay={300}>
          <SuitFigure />
          <p className="mt-4 text-lg">{dressCode.men.label}</p>
        </Reveal>
      </div>
    </SectionShell>
  );
}
