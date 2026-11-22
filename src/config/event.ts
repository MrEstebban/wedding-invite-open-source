/**
 * Todo el contenido editable de la invitación vive aquí.
 * Cambia textos, fechas, lugares e imágenes sin tocar los componentes.
 * Las fechas usan ISO 8601 con zona horaria explícita para evitar sorpresas en el servidor.
 */

export type IconName = "kingdomHall" | "glasses";

export interface Venue {
  icon: IconName;
  time: string;
  title: string;
  place: string;
  address: string;
  mapUrl: string;
}

export interface EventConfig {
  locale: string;
  timeZone: string;
  couple: { partner1: string; partner2: string };
  /** Fecha y hora de la conferencia bíblica. */
  date: string;
  /** Último momento en que los invitados pueden confirmar o cambiar su respuesta. */
  rsvpDeadline: string;
  music: { src: string };
  images: { hero: string; quote: string };
  quote: { text: string; author?: string };
  parents: { title: string; names: string[] }[];
  venues: Venue[];
  dressCode?: {
    title: string;
    note: string;
    reservedColors: { text: string; swatches: string[] };
    women: { label: string; image: string };
    men: { label: string };
  };
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
      icon: "kingdomHall",
      time: "08:00 pm",
      title: "Conferencia Bíblica",
      place: "Salón del Reino de los Testigos de Jehová",
      address: "Av. Hidalgo 120, Centro, La Piedad",
      mapUrl: "https://maps.google.com/?q=Salon+del+Reino+La+Piedad",
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
  dressCode: {
    title: "Código de vestimenta",
    note: "Nos reservamos el blanco para la novia y el morado para el novio.",
    reservedColors: {
      text: "Te pedimos evitar el morado, el amarillo y cualquiera de sus tonos derivados.",
      swatches: ["#4f2d7f", "#8c6bb8", "#bdb0d0", "#e5b62e", "#f7c932", "#fceea8"],
    },
    women: { label: "Mujeres: vestido de cóctel o gala", image: "/images/dress-women.png" },
    men: { label: "Hombres: traje, corbata opcional" },
  },
};

export const coupleNames = `${event.couple.partner1} & ${event.couple.partner2}`;
