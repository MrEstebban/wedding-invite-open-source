/**
 * Todo el contenido editable de la invitación vive aquí.
 * Cambia textos, fechas, lugares e imágenes sin tocar los componentes.
 * Las fechas usan ISO 8601 con zona horaria explícita para evitar sorpresas en el servidor.
 */

export type IconName = "church" | "rings" | "glasses" | "dinner" | "party" | "camera";

export interface Venue {
  icon: IconName;
  time: string;
  title: string;
  place: string;
  address: string;
  mapUrl: string;
}

export interface ItineraryItem {
  icon: IconName;
  time: string;
  label: string;
}

export interface BankAccount {
  bank: string;
  holder: string;
  number: string;
}

export interface EventConfig {
  locale: string;
  timeZone: string;
  couple: { partner1: string; partner2: string };
  /** Fecha y hora de la ceremonia. */
  date: string;
  /** Último momento en que los invitados pueden confirmar o cambiar su respuesta. */
  rsvpDeadline: string;
  music: { src: string };
  images: { hero: string; quote: string };
  quote: { text: string; author?: string };
  parents: { title: string; names: string[] }[];
  venues: Venue[];
  itinerary: ItineraryItem[];
  gifts?: {
    title: string;
    text: string;
    accounts: BankAccount[];
    registries: { label: string; url: string }[];
  };
  dressCode?: { title: string; note: string; women: string; men: string };
  noKids?: { title: string; text: string };
}

export const event: EventConfig = {
  locale: "es-MX",
  timeZone: "America/Mexico_City",
  couple: { partner1: "Tefy", partner2: "Duvan" },
  date: "2026-12-31T20:00:00-06:00",
  rsvpDeadline: "2026-12-31T23:59:59-06:00",
  music: { src: "/audio/song.mp3" },
  images: {
    hero: "/images/hero.jpeg",
    quote: "/images/quote.png",
  },
  quote: {
    text: "Cuando te das cuenta de que quieres pasar el resto de tu vida con alguien, deseas que el resto de tu vida comience cuanto antes.",
  },
  parents: [
    { title: "Padres de la novia", names: ["María López Hernández", "José Ramírez Torres"] },
    { title: "Padres del novio", names: ["Laura Gutiérrez Soto", "Miguel Ángel Díaz Ruiz"] },
  ],
  venues: [
    {
      icon: "church",
      time: "08:00 pm",
      title: "Ceremonia",
      place: "Parroquia de San Francisco",
      address: "Av. Hidalgo 120, Centro, La Piedad",
      mapUrl: "https://maps.google.com/?q=Parroquia+de+San+Francisco+La+Piedad",
    },
    {
      icon: "glasses",
      time: "09:00 pm",
      title: "Recepción",
      place: "Salón Terraza Magnolias",
      address: "Lázaro Cárdenas, 59374 La Piedad de Cabadas",
      mapUrl: "https://maps.google.com/?q=Salon+Terraza+Magnolias+La+Piedad",
    },
  ],
  itinerary: [
    { icon: "church", time: "08:00 pm", label: "Ceremonia" },
    { icon: "glasses", time: "09:00 pm", label: "Recepción" },
    { icon: "dinner", time: "10:00 pm", label: "Cena" },
    { icon: "party", time: "11:00 pm", label: "Fiesta" },
  ],
  gifts: {
    title: "Mesa de regalos",
    text: "Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, puedes hacerlo aquí:",
    accounts: [{ bank: "BBVA", holder: "Amelia Ramírez Gutiérrez", number: "0000 0000 0000 0000" }],
    registries: [{ label: "Liverpool · Evento 00000000", url: "https://mesaderegalos.liverpool.com.mx/" }],
  },
  dressCode: {
    title: "Código de vestimenta",
    note: "Nos reservamos el blanco para la novia",
    women: "Mujeres de largo",
    men: "Hombres de traje",
  },
  noKids: {
    title: "Sin niños",
    text: "Amamos a sus pequeños, pero queremos que en este día solo tengan que preocuparse por pasarla increíble.",
  },
};

export const coupleNames = `${event.couple.partner1} & ${event.couple.partner2}`;
