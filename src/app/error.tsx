"use client";

import { MessageScreen } from "@/components/ui/MessageScreen";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <MessageScreen title="Algo salió mal">
      No pudimos cargar tu invitación en este momento.
      <button
        type="button"
        onClick={reset}
        className="mt-8 block w-full rounded-full bg-sage-dark px-6 py-3 font-sans text-sm text-cream transition hover:bg-sage"
      >
        Intentar de nuevo
      </button>
    </MessageScreen>
  );
}
