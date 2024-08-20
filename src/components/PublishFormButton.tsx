import React from "react";
import { useFormStatus } from "react-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { FormFieldSchemaType } from "/src/schema";

interface PublishFormButtonProps {
  formId: string;
}

export const PublishFormButton = (props: PublishFormButtonProps) => {
  const { pending } = useFormStatus();
  const { id } = useParams();

  return (
    <>
      <SignedOut>
        <SignInButton forceRedirectUrl={`/f/${id}/edit`}>
          <button type={"button"} className="btn btn-primary">
            Log in to save your form
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <button
          name="formId"
          value={props.formId}
          type={"submit"}
          disabled={pending}
          className="btn btn-primary"
        >
          {pending ? "Saving form..." : "Save form and exit"}
        </button>
      </SignedIn>
    </>
  );
};
