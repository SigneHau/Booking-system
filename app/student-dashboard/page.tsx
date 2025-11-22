import React from 'react'
import PrimaryCard from "../components/PrimaryCard"

const StudentDashboard = () => {
  return (

   <div className="flex min-h-screen">
  {/* <!-- Sidebar --> */}
  <aside className="w-74 bg-Primary p-4">
    Sidebar indhold
  </aside>

  {/* <!-- Hovedindhold --> */}
  <main className="flex-1 bg-white p-4">
    Hovedindhold
  </main>
</div>
  )
}

export default StudentDashboard

