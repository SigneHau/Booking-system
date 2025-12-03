"use client"

import RoleBadge from "@/app/components/RoleBadge"

export default function HelpPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Sådan booker du</h1>
        {/* ⚡️ viser brugerens rolle */}
        <RoleBadge />
      </div>

      <ol className="list-decimal pl-6 space-y-4 text-lg leading-7">
        <li>
          <strong>Åbn “Book lokaler”</strong>
          <p>
            I menuen til venstre klikker du på “Book lokaler”, hvor du kommer
            til oversigten med filtreringsmuligheder og lokaler.
          </p>
        </li>

        <li>
          <strong>Vælg dag og dato</strong>
          <p>
            Brug dag- og datofeltet til at vælge præcis hvilken dag du ønsker at
            booke. Når du klikker på datoen, åbner en kalender, hvor du kan
            vælge dato direkte.
          </p>
        </li>

        <li>
          <strong>Vælg tidsrum</strong>
          <p>
            Vælg start- og sluttidspunkt for din booking. Systemet opdaterer
            derefter automatisk hvilke lokaler der er ledige i det tidsrum.
          </p>
        </li>

        <li>
          <strong>Se listen over lokaler</strong>
          <p>
            Under filtrene vises en tabel med alle tilgængelige lokaler. Her kan
            du se:
          </p>
          <ul className="list-disc pl-6">
            <li>Lokalenummer</li>
            <li>Kapacitet</li>
            <li>Status (Ledig eller Optaget)</li>
            <li>En “Book”-knap, hvis lokalet er ledigt</li>
          </ul>
        </li>

        <li>
          <strong>Book et ledigt lokale</strong>
          <p>
            Når du har fundet et lokale med status “Ledig”, klikker du på
            “Book”. Du får nu vist en lille bekræftelse, hvor dato, tid og
            lokale står tydeligt.
          </p>
        </li>

        <li>
          <strong>Bekræft din booking</strong>
          <p>
            Klik på “Bekræft booking” for endeligt at reservere lokalet. Din
            booking bliver nu gemt i systemet.
          </p>
        </li>

        <li>
          <strong>Gå til “Mine bookinger”</strong>
          <p>
            I venstre menu klikker du på “Mine bookinger” for at se alle dine
            aktive reservationer samlet ét sted. Her står både lokale, tidspunkt
            og status.
          </p>
        </li>

        <li>
          <strong>Aflys en booking (valgfrit)</strong>
          <p>
            Hvis du vil annullere en af dine bookinger, klikker du på
            “Annuller”. Der kommer nu et popup-vindue, der spørger “Vil du
            annullere din booking?”. Klik “Ja, annuller” for at gennemføre og få
            besked om, at bookingen er slettet.
          </p>
        </li>
      </ol>
    </div>
  );
}
