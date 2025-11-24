"use client"

import DashboardLayout from "../dashboard/layout"
import FilterCard from "../components/FilterCard"

export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <div className="flex font-semibold mt-4 mb-24 text-3xl">
        <h1>Book lokaler</h1>
      </div>
      <FilterCard />
    </DashboardLayout>
  )
}
