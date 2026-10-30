import { MessageScreen } from "@/components/ui/MessageScreen";
import { coupleNames } from "@/config/event";

export default function HomePage() {
  return (
    <MessageScreen title={coupleNames}>
      Esta invitación es personal. Abre el enlace que recibiste para ver tu invitación y confirmar tu asistencia.
    </MessageScreen>
  );
}
