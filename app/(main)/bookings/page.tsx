"use client"

import { useState, useEffect } from "react"
import { Paper, Loader, Center } from "@mantine/core"
import { useUser } from "@/hooks/useUser"
import RoleBadge from "@/app/components/RoleBadge"
import UserBookingsTable, { Booking } from "@/app/components/UserBookingsTable"
import { getUserBookings } from "@/lib/booking"

const BookingPage = () => {
  const { user } = useUser() // Henter den aktuelle bruger
  const [bookings, setBookings] = useState<Booking[]>([]) // State til alle brugerens bookinger
  const [loading, setLoading] = useState(true) // State til at vise loader/spinner

  // Funktion: Hent bookinger og sæt dem i state. 
  // loadBookings bruges som funktion til at genindlæse bookinger, fx når en booking slettes.
  async function loadBookings() {
    if (!user?.id) return // Vent til user er hentet
    setLoading(true) // Start loader: spinner vises mens data hentes
    const data = await getUserBookings(user.id) // Hent bookinger fra lib/booking
    setBookings(data) // Opdater state med de hentede bookinger
    setLoading(false) // Stop loader: spinner skjules når data er hentet
  }

  // useEffect: Når user-data er hentet → hent alle bookinger. 
  // UseEffect- sikrer, at bookinger hentes automatisk, når siden åbnes, eller når user ændres.
  useEffect(() => {
    if (!user?.id) return

    const fetch = async () => {
      setLoading(true) // Loaderspinner vises mens data hentes
      const data = await getUserBookings(user.id) 
      setBookings(data) // Opdater state med hentede bookinger
      setLoading(false) // Loader skjules når data er klar
    }

    fetch()
  }, [user]) // Kør igen når user ændres

  // UI: Overskrift + RoleBadge + indrammet tabel
  return (
    <div>
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Mine Bookinger</h1>
        <RoleBadge /> {/* Viser brugerens rolle */}
      </div>

      <Paper shadow="sm" radius="lg" withBorder p="xl" className="mt-8">
        <div className="font-semibold text-lg mb-4">Bookinger</div>

        {/* Loader vises når der hentes bookinger */}
        {loading ? (
          <Center>
            <Loader size="lg" />
          </Center>
        ) : (
          // Tabel over brugerens bookinger
          <UserBookingsTable bookings={bookings} refresh={loadBookings} />
        )}
      </Paper>
    </div>
  )
}

export default BookingPage

// Kort opsummering til eksamen:
// - loading state: useState styrer, hvornår spinner vises
// - useEffect: loader aktiveres når data hentes og slukkes igen
// - loadBookings: henter aktuelle bookinger for brugeren fra lib/booking og opdaterer state
