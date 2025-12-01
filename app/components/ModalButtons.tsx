// -------------------------------------------
// Definerer typen for en enkelt knap
// label  = teksten på knappen
// action = funktionen der skal køre når man klikker
// -------------------------------------------
type Button = {
  label: string
  action: () => void
  color?: "blue" | "red"
}

// -------------------------------------------
// Props-typen for selve komponenten
// Den forventer et array af Button-objekter
// -------------------------------------------
type Props = {
  buttons: Button[]
}

// -------------------------------------------
// Et opslag (map) over hvilke CSS-klasser
// der hører til hver farve
// blå knap → blå baggrund + hover
// rød knap → rød baggrund + hover
// -------------------------------------------
const colorClasses: Record<string, string> = {
  blue: "bg-blue-800 hover:bg-blue-700",
  red: "bg-red-600 hover:bg-red-500",
}

// -------------------------------------------
// ModalButtons-komponenten
// Den modtager props.buttons og genererer
// én <button> pr. element i arrayet
// -------------------------------------------
export default function ModalButtons({ buttons }: Props) {
  return (
    <div className="flex justify-center gap-3 pt-3">
      {buttons.map((btn, index) => (
        <button
          key={index}
          className={`${
            colorClasses[btn.color || "blue"]
          } text-white px-4 py-2 rounded-md hover:scale-105 transition cursor-pointer`}
          onClick={btn.action}
        >
          {btn.label}
        </button>
      ))}
    </div>
  )
}

//Hvad gør komponentet “ModalButtons”?
// -------------------------------------------
// Komponenten er en genanvendelig knap-gruppe, som:
// modtager et array af knap-objekter (label, action, farve)
// genererer en <button> for hver knap
// giver korrekt styling baseret på farven (blue/red)
// placerer knapperne side-om-side midt i modalet
// sørger for hover-effekt og klik-handler
//
// Du bruger den for eksempel i dine modaler, hvor du sender 2 knapper ind:
// “Ja” med blå styling
// “Nej” med rød styling
// → og komponenten bygger begge knapper automatisk.
// -------------------------------------------
