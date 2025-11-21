import LoginForm from "./components/LoginForm"
import PrimaryButton from "./components/PrimaryButton"



export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-40  font-sans bg-white">
     
      <div>
        <img src="/login-billede.png" alt="Logind billede" width={400}
          height={300} />

      </div>
      <div>
        
        <img src="/loge-ek-navn.png" alt="logo navn" width={300}
          height={200} />

        <LoginForm />
      </div>

    </div>
  )
}
