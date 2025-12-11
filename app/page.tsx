"use client"

import Image from "next/image"
import LoginForm from "@/app/components/LoginForm" 

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans p-6">

      {/* Venstre billede */}
      <div className="mr-[200px]">
        <Image
          src="/login-billede.png"
          alt="Login billede"
          width={400}
          height={300}
          loading="eager" // indlæs straks
        />
      </div>

      {/* Højre kolonne */}
      <div className="flex flex-col">

        {/* Logo */}
        <div>
          <Image
            src="/logo-ek-navn.png"
            alt="Logo"
            width={300}
            height={200}
            loading="eager"
          />
        </div>

        {/* Login form komponent */}
        <div className="mt-12">
          <LoginForm /> 
        </div>

      </div>
    </div>
  )
}
