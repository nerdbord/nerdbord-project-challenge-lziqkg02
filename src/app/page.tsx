"use client";
import React, { useEffect } from "react";
import { generateForm } from "/src/app/actions";
import { useFormState, useFormStatus } from "react-dom";

import Link from "next/link";
import { GenerateFormButton } from "/src/components/GenerateFormButton";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import CustomAccordion from "../components/CustomAccordion";

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

const FormGenerator = () => {
  const [state, formAction] = useFormState(generateForm, initialState);
  const { pending } = useFormStatus();
  const [value, setValue] = React.useState("");

  const memoRandomPrompt = React.useMemo(() => {
    return formPrompts[Math.floor(Math.random() * formPrompts.length)];
  }, []);

  useEffect(() => {
    console.log("Pending state changed:", pending);
  }, [pending]);

  useEffect(() => {
    setValue(memoRandomPrompt);
  }, [memoRandomPrompt]);


  
  return (
    <div className="min-h-screen bg-white text-center">
      <main className="text-gray-900 min-w-[320px] mx-auto px-4 mt-12">
{/* loading do odkomentowania, nie działa mi tu pending, z useFormStatus też nie. */}
{/* <LoadingScreen /> */}

{/* wszystko niżej do zakomentowania, nie działa mi tu pending, z useFormStatus też nie. */}

        <h1 className="text-3xl font-semibold text-center text-[#4338CA] leading-[40px] font-roboto mb-2">
          {"Instant forms"} <br /> {"worth filling"}
        </h1>
        <h2 className="text-center text-[16px] font-roboto leading-[24px] text-[#94A3B8] mb-8">
          {"powered with AI"}
        </h2>
        <form action={formAction}>
          <div className="flex flex-col items-center w-full max-w-xl mx-auto">
            <textarea
              name="prompt"
              value={value}
              onChange={(e) => {
                setValue(e.currentTarget.value);
              }}
              placeholder="Describe form you want to create..."
              className="flex-grow self-stretch overflow-hidden text-gray-900 placeholder:text-[#D1D5DB] text-sm font-roboto leading-[20px] p-2 border border-gray-300 rounded-lg w-full mb-4 min-h-[112px] focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
            <CustomAccordion />
            <div className="flex flex-col items-center w-full mt-4">
              <GenerateFormButton />
              <div className="flex items-center w-full m-2">
                <div className="border-t border-gray-300 flex-grow mr-2"></div>
                <span className="text-gray-500">or</span>
                <div className="border-t border-gray-300 flex-grow ml-2"></div>
              </div>
              <SignedOut>
              <SignInButton>
                <button className="btn btn-outline w-full">
                  Log in
                </button>
              </SignInButton>
              </SignedOut>
            </div>
          </div>
        </form>

{/* koniec komentarza */}

      </main>
    </div>
  );
};

export default FormGenerator;