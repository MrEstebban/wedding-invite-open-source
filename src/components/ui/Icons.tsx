import type { ReactNode } from "react";
import type { IconName } from "@/config/event";

const PATHS: Record<IconName, ReactNode> = {
  church: (
    <>
      <path d="M24 4v8M20 8h8" />
      <path d="M13 22 24 12l11 10" />
      <path d="M15 20v22h18V20" />
      <path d="M21 42v-7a3 3 0 0 1 6 0v7" />
      <path d="M10 42h28" />
      <circle cx="24" cy="26" r="2.5" />
    </>
  ),
  rings: (
    <>
      <circle cx="19" cy="29" r="10" />
      <circle cx="29" cy="29" r="10" />
      <path d="m16 12 3-4 3 4-3 3z" />
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
  dinner: (
    <>
      <circle cx="24" cy="26" r="11" />
      <circle cx="24" cy="26" r="6" />
      <path d="M7 13v8a2 2 0 0 0 2 2v15M9 13v8M11 13v8" />
      <path d="M41 13c-3 2-3 9 0 11v14" />
    </>
  ),
  party: (
    <>
      <path d="M24 4v10" />
      <circle cx="24" cy="27" r="12" />
      <path d="M12 27h24M14 21h20M14 33h20" />
      <path d="M24 15c-5 3-5 21 0 24M24 15c5 3 5 21 0 24" />
    </>
  ),
  camera: (
    <>
      <rect x="6" y="14" width="36" height="24" rx="3" />
      <circle cx="24" cy="26" r="7" />
      <path d="m17 14 3-5h8l3 5" />
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
