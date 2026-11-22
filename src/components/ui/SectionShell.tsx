import type { ReactNode } from "react";
import { Floral } from "@/components/ui/Floral";

const TONES = {
  white: "bg-white",
  mist: "bg-mist",
  lilac: "bg-lilac-soft",
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
  tone = "white",
  florals = false,
  tall = true,
  className = "",
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`relative flex flex-col items-center justify-center overflow-hidden px-6 py-20 text-center ${
        tall ? "min-h-[90svh]" : ""
      } ${TONES[tone]} ${className}`}
    >
      {florals && (
        <>
          <Floral className="pointer-events-none absolute top-0 left-0 w-40 sm:w-56" />
          <Floral className="pointer-events-none absolute right-0 bottom-0 w-40 rotate-180 sm:w-56" />
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
        <span className="-my-1 block font-script text-4xl tracking-normal text-ink normal-case sm:text-5xl">
          {script}
        </span>
      )}
      {bottom && <span className="block">{bottom}</span>}
    </h2>
  );
}

export function Divider() {
  return (
    <div className="mx-auto my-6 flex items-center justify-center gap-3 text-sunflower-deep" aria-hidden="true">
      <span className="h-px w-12 bg-current opacity-60" />
      <span className="text-xs">✦</span>
      <span className="h-px w-12 bg-current opacity-60" />
    </div>
  );
}
