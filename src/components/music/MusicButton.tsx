"use client";

import { MusicNoteIcon, PauseIcon } from "@/components/ui/Icons";
import { useMusic } from "@/components/music/MusicProvider";

export function MusicButton() {
  const { playing, toggle } = useMusic();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Pausar música" : "Reproducir música"}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-50 flex size-12 items-center justify-center rounded-full bg-cream/90 text-ink shadow-lg ring-1 ring-ink/10 backdrop-blur transition hover:scale-105 active:scale-95"
    >
      {playing && <span className="animate-pulse-ring absolute inset-0 rounded-full ring-2 ring-sage" aria-hidden="true" />}
      {playing ? <PauseIcon className="size-5" /> : <MusicNoteIcon className="size-5" />}
    </button>
  );
}
