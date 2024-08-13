import React from "react";
import { generateForm, saveAndPublishForm } from "/src/app/actions";
import { useFormState, useFormStatus } from "react-dom";

interface PublishFormButtonProps {
  formId: string;
}

export const PublishFormButton = (props: PublishFormButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      name="formId"
      value={props.formId}
      disabled={pending}
      className="px-4 py-2 border border-black rounded-md text-lg"
    >
      {pending ? "Saving form..." : "Save and exit"}
    </button>
  );
};
