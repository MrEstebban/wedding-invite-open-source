import type { ReactNode } from "react";
import { Floral } from "@/components/ui/Floral";

const TONES = {
  paper: "bg-paper",
  cream: "bg-cream",
  taupe: "bg-taupe",
} as const;

interface SectionShellProps {
  id?: string;
  tone?: keyof typeof TONES;
  /** Watercolor branches in opposite corners. */
  florals?: boolean;
  /** Fill most of the viewport for the immersive, one-section-at-a-time feel. */
  tall?: boolean;
  className?: string;
  children: ReactNode;
}

export function SectionShell({
  id,
  tone = "paper",
  florals = false,
  tall = true,
  className = "",
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`paper-texture relative flex flex-col items-center justify-center overflow-hidden px-6 py-20 text-center ${
        tall ? "min-h-[90svh]" : ""
      } ${TONES[tone]} ${className}`}
    >
      {florals && (
        <>
          <Floral className="pointer-events-none absolute -top-4 -left-10 w-36 opacity-60 sm:w-48" />
          <Floral className="pointer-events-none absolute -right-10 -bottom-4 w-36 rotate-180 opacity-60 sm:w-48" />
        </>
      )}
      <div className="relative w-full max-w-md sm:max-w-lg">{children}</div>
    </section>
  );
}

interface SectionTitleProps {
  top: string;
  /** Calligraphic word between the two serif lines, e.g. "tu" in "Confirma tu asistencia". */
  script?: string;
  bottom?: string;
}

export function SectionTitle({ top, script, bottom }: SectionTitleProps) {
  return (
    <h2 className="font-serif text-3xl leading-tight font-medium tracking-[0.1em] text-ink uppercase sm:text-4xl">
      <span className="block">{top}</span>
      {script && (
        <span className="-my-1 block font-script text-3xl tracking-normal text-sage-dark normal-case sm:text-4xl">
          {script}
        </span>
      )}
      {bottom && <span className="block">{bottom}</span>}
    </h2>
  );
}

export function Divider() {
  return (
    <div className="mx-auto my-6 flex items-center justify-center gap-3 text-gold" aria-hidden="true">
      <span className="h-px w-12 bg-current opacity-60" />
      <span className="text-xs">✦</span>
      <span className="h-px w-12 bg-current opacity-60" />
    </div>
  );
}
