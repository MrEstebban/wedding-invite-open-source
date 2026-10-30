import { MessageScreen } from "@/components/ui/MessageScreen";

/** Same response for malformed and unknown tokens, so nothing leaks about which links exist. */
export default function NotFound() {
  return (
    <MessageScreen title="Invitación no encontrada">
      Revisa que el enlace esté completo, tal como lo recibiste. Si el problema continúa, comunícate con los novios.
    </MessageScreen>
  );
}
