import type { ReactNode } from "react";
import type { IconName } from "@/config/event";

const PATHS: Record<IconName, ReactNode> = {
  // Low, wide hall with a shallow roof and a front sign, like a Kingdom Hall (no steeple or cross).
  kingdomHall: (
    <>
      <path d="M4 22 24 13l20 9" />
      <path d="M8 20.5V38h32V20.5" />
      <path d="M20 38v-9h8v9" />
      <path d="M18 29h12" />
      <rect x="11.5" y="25" width="5" height="5" />
      <rect x="31.5" y="25" width="5" height="5" />
      <rect x="18" y="18" width="12" height="4" rx="0.5" />
      <path d="M2 38h44" />
    </>
  ),
  glasses: (
    <>
      <path d="M12 10h9l-1 11a3.5 3.5 0 0 1-7 0z" />
      <path d="M16.5 24.5V38M12 38h9" />
      <path d="M27 10h9l-1 11a3.5 3.5 0 0 1-7 0z" />
      <path d="M31.5 24.5V38M27 38h9" />
      <path d="M24 4v3M19 6l1.5 2M29 6l-1.5 2" />
    </>
  ),
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

export function MusicNoteIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M9 18V6l11-2v12" strokeLinejoin="round" />
      <circle cx="6.5" cy="18" r="2.5" fill="currentColor" />
      <circle cx="17.5" cy="16" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="7" y="5" width="3.5" height="14" rx="1" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
    </svg>
  );
}
