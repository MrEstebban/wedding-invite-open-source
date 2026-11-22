import { Floral } from "@/components/ui/Floral";
import { Reveal } from "@/components/ui/Reveal";
import { coupleNames } from "@/config/event";
import { formatShortDate } from "@/lib/dates";

export function Closing() {
  return (
    <footer className="relative overflow-hidden bg-white px-6 pt-28 pb-36 text-center text-ink">
      <Floral className="pointer-events-none absolute top-0 left-0 w-36 sm:w-48" />
      <Floral className="pointer-events-none absolute right-0 bottom-0 w-36 rotate-180 sm:w-48" />
      <Reveal className="relative">
        <p className="text-lg italic">¡Gracias por ser parte de nuestra historia!</p>
        <p className="mt-6 font-script text-5xl">{coupleNames}</p>
        <p className="mt-4 font-sans text-sm tracking-[0.35em]">{formatShortDate()}</p>
      </Reveal>
    </footer>
  );
}
