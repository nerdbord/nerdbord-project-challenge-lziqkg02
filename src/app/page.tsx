"use client";
import React from "react";
import { generateForm } from "/src/app/actions";
import { useFormState } from "react-dom";
import { generateText } from "ai";
import Link from "next/link";

type FormGeneratorProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
};

const initialState = {
  message: "",
};

const formPrompts = [
  "Utwórz formularz do zapisania się na wizytę u fryzjera z polami na imię, nazwisko, numer telefonu, preferowany termin i rodzaj usługi.",
  "Stwórz formularz zgłoszenia usterki lub problemu technicznego z polami na opis problemu, numer kontaktowy, adres e-mail i opcje wyboru rodzaju problemu (np. sprzęt, oprogramowanie, internet).",
  "Przygotuj formularz zamówienia jedzenia do biura z polami na wybór dań, preferencje dietetyczne, godzina dostawy, numer kontaktowy i sposób płatności.",
  "Zaprojektuj formularz rejestracji uczestników wydarzenia z polami na imię, nazwisko, adres e-mail, numer telefonu oraz opcjonalne pole na pytania do organizatorów.",
  "Stwórz formularz ankiety satysfakcji klienta z polami na ocenę jakości usług, komentarze, oraz opcje wyboru najważniejszych kryteriów oceny.",
  "Utwórz formularz zamówienia produktu online z polami na nazwę produktu, ilość, dane kontaktowe, adres dostawy oraz preferowaną metodę płatności.",
  "Przygotuj formularz do zgłoszenia nieobecności w pracy z polami na imię, nazwisko, datę nieobecności, powód oraz dane kontaktowe.",
  "Zaprojektuj formularz do rejestracji na zajęcia sportowe z polami na imię, nazwisko, poziom zaawansowania, wybrane zajęcia oraz preferowany termin.",
  "Stwórz formularz do zbierania opinii o nowym produkcie z polami na ocenę, komentarze, sugestie zmian oraz dane kontaktowe.",
  "Utwórz formularz rejestracji na webinar z polami na imię, nazwisko, adres e-mail oraz opcjonalne pytania do prelegenta.",
];

const FormGenerator: React.FC<FormGeneratorProps> = ({
  title = "Instant forms worth filling",
  subtitle = "powered with AI",
  placeholder = "Enter prompt text...",
  buttonText = "Generate",
}) => {
  const [state, formAction, pending] = useFormState(generateForm, initialState);
  const [value, setValue] = React.useState("");

  console.log("state", state);
  console.log("formAction", formAction);
  console.log("pending", pending);

  const memoRandomPrompt = React.useMemo(() => {
    return formPrompts[Math.floor(Math.random() * formPrompts.length)];
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center">
      <header className="absolute top-8 right-8 flex items-center space-x-4">
        <Link href={"/f"} className="text-black">
          Forms database
        </Link>
        <button className="bg-black text-white py-2 px-4 rounded-lg">
          Log in
        </button>
      </header>
      <main className="w-1/3 text-gray-900">
        <h1 className="text-2xl font-bold">{title}</h1>
        <h2 className="text-gray-500 mb-8">{subtitle}</h2>
        <form action={formAction}>
          <div className="flex flex-col items-center">
            <textarea
              name="prompt"
              value={memoRandomPrompt}
              onChange={(e) => {
                setValue(e.currentTarget.value);
              }}
              placeholder={
                placeholder ||
                "Wygeneruj mi formularz dla moich gości urodzinowych, którzy będą mieli ochotę na pizzę 🍕"
              }
              className="border border-gray-400 rounded-lg p-2 w-full mb-4 min-h-[112px]"
            />
            <button
              type={"submit"}
              disabled={pending}
              className="bg-black text-white py-2 px-6 rounded-lg flex items-center"
            >
              {pending ? "Generating form..." : buttonText}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default FormGenerator;
