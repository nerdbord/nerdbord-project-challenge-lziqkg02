import React from "react";
import { useFormStatus } from "react-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useParams } from "next/navigation";

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
          <button
            type={"button"}
            className="px-4 py-2 border border-black rounded-md text-lg"
          >
            Login to save
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <button
          name="formId"
          value={props.formId}
          type={"submit"}
          disabled={pending}
          className="px-4 py-2 border border-black rounded-md text-lg"
        >
          {pending ? "Saving form..." : "Save and exit"}
        </button>
      </SignedIn>
    </>
  );
};
