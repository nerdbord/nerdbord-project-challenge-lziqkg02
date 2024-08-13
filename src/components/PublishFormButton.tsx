import React from "react";
import { generateForm, saveAndPublishForm } from "/src/app/actions";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
};

interface PublishFormButtonProps {
  formId: string;
}

export const PublishFormButton = (props: PublishFormButtonProps) => {
  const [state, formAction, pending] = useFormState(
    saveAndPublishForm,
    initialState,
  );

  return (
    <form action={formAction}>
      <button
        name="formId"
        value={props.formId}
        className="px-4 py-2 border border-black rounded-md text-lg"
      >
        {pending ? "Saving form..." : "Save and exit"}
      </button>
    </form>
  );
};
