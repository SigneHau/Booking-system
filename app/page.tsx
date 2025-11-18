import LoginForm from "./components/LoginForm"
import PrimaryButton from "./components/PrimaryButton"
import PrimaryCard from "./components/PrimaryCard"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans bg-white">
      <PrimaryButton />
      <div className="mt-8 max-w-sm mx-auto bg-white p-4 rounded-xl shadow">
        <PrimaryCard />
      </div>
      <div>
        <LoginForm />
      </div>
    </div>
  )
}

