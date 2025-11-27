"use client";
import React from "react"

import { useUser } from "@/app/contexts/UserContext";
import RoleBadge from "@/app/components/RoleBadge";

const StudentBookingPage = () => {
const user = useUser(); // <-- her får vi user
  
  return (
   
     
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
      <h1>Mine Bokinger
      </h1>
      <RoleBadge role={user?.role ?? "unknown"} />
    </div>
    
  )
}

export default StudentBookingPage
