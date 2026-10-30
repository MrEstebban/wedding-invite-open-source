"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copiar" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. in-app browsers); the number stays visible to copy by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-sage/50 px-4 py-1.5 font-sans text-xs tracking-wide text-sage-dark transition hover:bg-sage/10"
      aria-live="polite"
    >
      {copied ? "¡Copiado!" : label}
    </button>
  );
}
