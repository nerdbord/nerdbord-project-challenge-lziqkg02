import React from "react";
import { generateForm, saveAndPublishForm } from "/src/app/actions";
import { useFormState, useFormStatus } from "react-dom";

export const GenerateFormButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type={"submit"}
      disabled={pending}
      className="bg-black text-white py-2 px-6 rounded-lg flex items-center"
    >
      {pending ? "Generating form..." : "Generate"}
    </button>
  );
};
