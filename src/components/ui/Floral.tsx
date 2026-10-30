/** Decorative watercolor-style branch, drawn inline so it costs no extra request. */
export function Floral({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 200" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="#8b9a7c" strokeWidth="1.2" strokeLinecap="round">
        <path d="M8 4c18 34 34 70 58 104s46 58 86 88" />
        <path d="M44 66c10-4 22-2 30 6" />
        <path d="M90 136c10-8 24-10 36-6" />
      </g>
      <g fill="#c8d1bd" stroke="#8b9a7c" strokeWidth="0.8" opacity="0.85">
        <path d="M24 34c-12-2-20-12-20-12s12-6 24 0c-1 6-2 9-4 12z" />
        <path d="M30 40c4-12 14-18 14-18s4 13-4 22c-4-1-7-2-10-4z" />
        <path d="M46 72c-13 1-22-7-22-7s10-9 23-5c0 5 0 9-1 12z" />
        <path d="M56 82c6-11 17-15 17-15s2 14-8 21c-4-2-7-4-9-6z" />
        <path d="M76 110c-13 3-23-4-23-4s9-10 22-8c1 5 1 9 1 12z" />
        <path d="M88 118c8-10 20-12 20-12s0 14-11 20c-4-2-7-5-9-8z" />
        <path d="M110 150c-12 4-23-2-23-2s8-11 21-10c1 4 2 8 2 12z" />
        <path d="M126 160c9-9 21-9 21-9s-2 14-14 18c-3-3-6-6-7-9z" />
      </g>
      <g>
        <circle cx="74" cy="72" r="5" fill="#faf8f4" stroke="#b8a26a" strokeWidth="0.8" />
        <circle cx="66" cy="68" r="5" fill="#faf8f4" stroke="#b8a26a" strokeWidth="0.8" />
        <circle cx="70" cy="80" r="5" fill="#faf8f4" stroke="#b8a26a" strokeWidth="0.8" />
        <circle cx="79" cy="80" r="5" fill="#faf8f4" stroke="#b8a26a" strokeWidth="0.8" />
        <circle cx="72" cy="75" r="3" fill="#b8a26a" />
      </g>
    </svg>
  );
}
