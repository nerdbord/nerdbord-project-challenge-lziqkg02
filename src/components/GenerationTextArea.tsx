"use client";
import React from "react";

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

export const GenerationTextArea = (props: { placeholder?: string }) => {
  const [value, setValue] = React.useState("");

  const memoRandomPrompt = React.useMemo(() => {
    return formPrompts[Math.floor(Math.random() * formPrompts.length)];
  }, []);

  return (
    <textarea
      name="prompt"
      value={memoRandomPrompt}
      onChange={(e) => {
        setValue(e.currentTarget.value);
      }}
      placeholder={
        props.placeholder ||
        "Wygeneruj mi formularz dla moich gości urodzinowych, którzy będą mieli ochotę na pizzę 🍕"
      }
      className="border border-gray-400 rounded-lg p-2 w-full mb-4 min-h-[112px]"
    />
  );
};
