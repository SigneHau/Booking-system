import Image from "next/image";
import LoginForm from "./components/LoginForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">

      {/* Venstre billede */}
      <div className="mr-[200px]">
        <Image
          src="/login-billede.png"
          alt="Login billede"
          width={400}
          height={300}
        />
      </div>

      {/* Højre kolonne – intet andet */}
      <div className="flex flex-col">
        <Image
          src="/logo-ek-navn.png"
          alt="Logo"
          width={300}
          height={200}
        />


        <LoginForm />
      </div>

    </div>
  );
}
