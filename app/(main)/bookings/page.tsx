"use client"

import { useState, useEffect } from "react"
import { Paper, Loader, Center } from "@mantine/core"
import { useUser } from "@/hooks/useUser"
import RoleBadge from "@/app/components/RoleBadge"
import UserBookingsTable, { Booking } from "@/app/components/UserBookingsTable"
import { getUserBookings } from "@/lib/booking"

const BookingPage = () => {
  const { user } = useUser() // ⚡️ Henter den aktuelle bruger
  const [bookings, setBookings] = useState<Booking[]>([]) // ⚡️ State til alle brugerens bookinger
  const [loading, setLoading] = useState(true)

  // -------------------------------------------------------------
  // Funktion: Hent bookinger og sæt dem i state
  // -------------------------------------------------------------
  async function fetchBookings() {
    if (!user?.id) return // ⚡️ vent til user er hentet
    setLoading(true)
    const data = await getUserBookings(user.id) // Hent bookinger fra lib
    setBookings(data) // Opdater state
    setLoading(false)
  }

  // -------------------------------------------------------------
  // useEffect: Når user-data er hentet → hent alle bookinger
  // -------------------------------------------------------------
  useEffect(() => {
  if (!user?.id) return

  const fetch = async () => {
    setLoading(true)
    const data = await getUserBookings(user.id)
    setBookings(data)
    setLoading(false)
  }

  fetch()
}, [user]) // ⚡️ kør igen når user ændres

  // -------------------------------------------------------------
  // UI: Overskrift + RoleBadge + indrammet tabel
  // -------------------------------------------------------------
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
          <UserBookingsTable bookings={bookings} refresh={fetchBookings} />
        )}
      </Paper>
    </div>
  )
}

export default BookingPage

// -------------------------------------------------------------
// Kort opsummering til eksamen (Loader i Dashboard):
// - Loading state: useState styrer hvornår spinner vises
// - Loader placering: flyttet lidt op og til højre for bedre UI
// - useEffect: loader aktiveres når data hentes og slukkes igen
// getUserBookings: henter aktuelle bookinger for brugeren fra lib/booking

