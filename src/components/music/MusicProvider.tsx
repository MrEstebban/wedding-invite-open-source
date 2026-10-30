"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

interface MusicContextValue {
  playing: boolean;
  play: () => void;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

/**
 * Owns the single <audio> element for the whole invitation so playback state
 * survives scrolling between sections. Mobile browsers only allow playback
 * after a user gesture, so `play()` must be called from a tap (see EnvelopeIntro).
 */
export function MusicProvider({ src, children }: { src: string; children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeWhenVisible = useRef(false);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => setPlaying(false));
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else audio.pause();
  }, [play]);

  // Pause when the tab/app goes to the background and resume when the guest comes back.
  useEffect(() => {
    function handleVisibility() {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        resumeWhenVisible.current = !audio.paused;
        audio.pause();
      } else if (resumeWhenVisible.current) {
        resumeWhenVisible.current = false;
        play();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [play]);

  const value = useMemo(() => ({ playing, play, toggle }), [playing, play, toggle]);

  return (
    <MusicContext value={value}>
      {children}
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setPlaying(false)}
      />
    </MusicContext>
  );
}

export function useMusic(): MusicContextValue {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used inside <MusicProvider>");
  return context;
}
