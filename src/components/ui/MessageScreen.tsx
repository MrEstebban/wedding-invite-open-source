import type { ReactNode } from "react";
import { Floral } from "@/components/ui/Floral";

export function MessageScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="paper-texture relative flex min-h-svh items-center justify-center overflow-hidden bg-paper px-6 py-16 text-center">
      <Floral className="absolute -top-6 -left-8 w-40 opacity-70" />
      <Floral className="absolute -right-8 -bottom-6 w-40 rotate-180 opacity-70" />
      <div className="relative max-w-sm">
        <h1 className="font-serif text-3xl tracking-[0.12em] uppercase">{title}</h1>
        <div className="mx-auto my-6 h-px w-16 bg-gold" />
        <div className="text-lg leading-relaxed text-ink-soft">{children}</div>
      </div>
    </main>
  );
}
