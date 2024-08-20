import React from "react";
import { generateForm, saveAndPublishForm } from "/src/app/actions";
import { useFormState, useFormStatus } from "react-dom";
import GenerateFormBtnIcon from "./icons/GenerateFormBtnIcon";

export const GenerateFormButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type={"submit"}
      disabled={pending}
      className="btn btn-primary w-full py-2 text-white"
    >
      {"Generate new form"} <GenerateFormBtnIcon />
    </button>
  );
};
