"use client";

import { useSyncExternalStore } from "react";

const UNITS = [
  { label: "Días", seconds: 86_400 },
  { label: "Horas", seconds: 3_600 },
  { label: "Min", seconds: 60 },
  { label: "Seg", seconds: 1 },
] as const;

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

const nowInSeconds = () => Math.floor(Date.now() / 1000);
// The server cannot know the visitor's clock; render placeholders until hydration.
const serverSnapshot = () => null;

function splitDuration(totalSeconds: number): number[] {
  let rest = totalSeconds;
  return UNITS.map(({ seconds }) => {
    const value = Math.floor(rest / seconds);
    rest %= seconds;
    return value;
  });
}

export function CountdownTimer({ target }: { target: string }) {
  const now = useSyncExternalStore<number | null>(subscribe, nowInSeconds, serverSnapshot);
  const targetSeconds = Math.floor(new Date(target).getTime() / 1000);
  const remaining = now === null ? null : Math.max(0, targetSeconds - now);

  if (remaining === 0) {
    return <p className="font-script text-4xl text-sage-dark">¡Llegó el gran día!</p>;
  }

  const values = remaining === null ? null : splitDuration(remaining);

  return (
    <div className="grid grid-cols-4 gap-2" role="timer" aria-label="Tiempo restante para la boda">
      {UNITS.map((unit, index) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span className="font-serif text-3xl tabular-nums sm:text-4xl">
            {values ? String(values[index]).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 font-sans text-[0.65rem] tracking-[0.2em] text-ink-soft uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
