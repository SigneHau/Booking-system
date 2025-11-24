"use client"

import DashboardLayout from "../dashboard/layout"
import FilterCard from "../components/FilterCard"

export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <div className="flex mt-26 items-center justify-center font-light text-5xl">
        <h1>Book lokaler</h1>
      </div>
      <FilterCard />
    </DashboardLayout>
  )
}
