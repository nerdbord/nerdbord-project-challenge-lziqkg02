import { GeneratedForm } from "/src/components/GeneratedForm";
import { getForm } from "/src/app/actions";
import { redirect } from "next/navigation";
import { FormFieldSchemaType } from "/src/schema";
import { FormState } from "@prisma/client";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const foundForm = await getForm(id);

  if (!foundForm) {
    redirect("/");
  }

  if (foundForm.state === FormState.DRAFT) {
    redirect(`/f/${foundForm.id}/edit`);
  }

  return (
    <GeneratedForm
      formId={foundForm.id}
      formTitle={foundForm.title}
      fields={foundForm.fields as FormFieldSchemaType[]}
      state={foundForm.state}
    />
  );
}
