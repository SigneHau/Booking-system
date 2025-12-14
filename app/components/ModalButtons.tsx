

// Type for én knap (et objekt med label, action og evt. farve)
type Button = {
  label: string
  action: () => void
  color?: "blue" | "red"
}

// Props til komponenten
type Props = {
  buttons: Button[]
}

// Matcher farver med CSS-klasser
const colorClasses: Record<string, string> = {
  blue: "bg-blue-800 hover:bg-blue-700",
  red: "bg-red-600 hover:bg-red-500",
}

// Komponent der viser en gruppe knapper
export default function ModalButtons({ buttons }: Props) {
  return (
    <div className="flex justify-center gap-3 pt-3">
      {buttons.map((btn, index) => (
        <button
          key={index} // React key
          className={`${
            colorClasses[btn.color || "blue"]
          } text-white px-4 py-2 rounded-md hover:scale-105 transition cursor-pointer`}
          onClick={btn.action} // klik-handler
        >
          {btn.label} {/* tekst på knappen */}
        </button>
      ))}
    </div>
  )
}


// ModalButtons er en genanvendelig komponent, der modtager et array af knap-objekter
// og renderer en button for hver, med korrekt styling og klik-funktionalitet
