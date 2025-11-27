"use client";

import { useState, useEffect } from "react";
import FilterCard from "../../../components/FilterCard";
import AvailableRoomsCard from "../../../components/AvailableRoomsCard";
import { supabase } from "@/lib/supabaseClient";
import RoleBadge from "@/app/components/RoleBadge";
import { useUser } from "@/app/contexts/UserContext"; // <-- hent user fra context

type Filters = {
  floor: number | null;
  date: Date | null;
  from: string | null;
  to: string | null;
  role: "student" | "teacher";
};

export default function StudentDashboard() {
  const user = useUser(); // <-- her får vi user
  const [filters, setFilters] = useState<Filters>({
    floor: null,
    date: null,
    from: null,
    to: null,
    role: "student",
  });

  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    if (filters.floor && filters.date) {
      fetchRooms();
    }
  }, [filters]);

  async function fetchRooms() {
    const { floor, date, from, to, role } = filters;
    if (!floor || !date || !from || !to) return;

    let query = supabase
      .from("meetingrooms")
      .select("*")
      .eq("floor", floor);

    if (role === "student") {
      query = query.eq("local", "Mødelokale");
    }

    const { data: roomsData } = await query;
    const safeRooms = roomsData ?? [];

    let results: any[] = [];

    for (const room of safeRooms) {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("roomid", room.roomid)
        .eq("date", date);

      const safeBookings = bookings ?? [];

      const isBooked = safeBookings.some((b) => {
        const start = new Date(b.starting_at);
        const end = new Date(b.ending_at);
        const userStart = new Date(`${date}T${from}`);
        const userEnd = new Date(`${date}T${to}`);

        return (
          (userStart >= start && userStart < end) ||
          (userEnd > start && userEnd <= end) ||
          (userStart <= start && userEnd >= end)
        );
      });

      results.push({
        ...room,
        booked: isBooked,
        availability: room.availability,
      });
    }

    setRooms(results);
  }

  return (
    <div>
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Book et lokale</h1>
        <RoleBadge role={user?.role ?? "unknown"} />
      </div>

      <FilterCard setFilters={setFilters} />
      <AvailableRoomsCard rooms={rooms} />
    </div>
  );
}
