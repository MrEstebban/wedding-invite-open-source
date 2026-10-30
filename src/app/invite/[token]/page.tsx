import { notFound } from "next/navigation";
import { MusicButton } from "@/components/music/MusicButton";
import { MusicProvider } from "@/components/music/MusicProvider";
import { Closing } from "@/components/sections/Closing";
import { Countdown } from "@/components/sections/Countdown";
import { DressCode } from "@/components/sections/DressCode";
import { EnvelopeIntro } from "@/components/sections/EnvelopeIntro";
import { Gifts } from "@/components/sections/Gifts";
import { Hero } from "@/components/sections/Hero";
import { Itinerary } from "@/components/sections/Itinerary";
import { NoKids } from "@/components/sections/NoKids";
import { Parents } from "@/components/sections/Parents";
import { Quote } from "@/components/sections/Quote";
import { Rsvp } from "@/components/sections/Rsvp";
import { Venues } from "@/components/sections/Venues";
import { event } from "@/config/event";
import { toPublicGuest } from "@/lib/guest";
import { getGuestByToken } from "@/lib/guests";

// Every request re-validates the token against the sheet; nothing is cached or prerendered.
export const dynamic = "force-dynamic";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  if (!guest) notFound();

  const publicGuest = toPublicGuest(guest);

  return (
    <MusicProvider src={event.music.src}>
      <EnvelopeIntro guest={publicGuest} />
      <main>
        <Hero />
        <Countdown guest={publicGuest} />
        <Quote />
        <Parents />
        <Venues />
        <Itinerary />
        <Gifts />
        <DressCode />
        <NoKids />
        <Rsvp token={token} guest={publicGuest} />
      </main>
      <Closing />
      <MusicButton />
    </MusicProvider>
  );
}
