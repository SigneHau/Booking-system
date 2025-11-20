import LoginForm from "./components/LoginForm"
import PrimaryButton from "./components/PrimaryButton"
import PrimaryCard from "./components/PrimaryCard"
import SignUpForm from "./components/SignupForm"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center font-sans bg-gray-200">
      <PrimaryButton />
      <div className="mt-8 max-w-sm mx-auto bg-white p-4 rounded-xl shadow">
        <PrimaryCard />
      </div>
      <div>
        <LoginForm />
      </div>

      <div className="mb-12">
        <SignUpForm />
      </div>
    </div>
  )
}
