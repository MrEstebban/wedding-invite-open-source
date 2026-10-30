import { Reveal } from "@/components/ui/Reveal";
import { coupleNames } from "@/config/event";
import { formatShortDate } from "@/lib/dates";

export function Closing() {
  return (
    <footer className="paper-texture bg-sage-dark px-6 pt-20 pb-28 text-center text-cream">
      <Reveal>
        <p className="text-lg italic">¡Gracias por ser parte de nuestra historia!</p>
        <p className="mt-6 font-script text-5xl">{coupleNames}</p>
        <p className="mt-4 font-sans text-sm tracking-[0.35em]">{formatShortDate()}</p>
      </Reveal>
    </footer>
  );
}
