import React from 'react'
import PrimaryCard from "../components/PrimaryCard"

const StudentDashboard = () => {
  return (

    <div className="flex flex-col min-h-screen items-center justify-center font-sans bg-gray-200">
      <div>
        <h1> Velkommen til Student Dashboard</h1>
      </div>
      <div className="mt-8 max-w-sm mx-auto bg-white p-4 rounded-xl shadow">
        <PrimaryCard />
      </div>


      
    </div>
  )
}

export default StudentDashboard

