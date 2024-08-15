import { GeneratedForm } from "/src/components/GeneratedForm";
import { getForm, tryConnectUserToForm } from "/src/app/actions";
import { redirect } from "next/navigation";
import { FormFieldSchemaType } from "/src/schema";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const user = await currentUser();

  let foundForm = await getForm(id);

  if (!foundForm) {
    redirect("/");
  }

  if (!foundForm?.clerkUserId && !!user?.id) {
    const updatedForm = await tryConnectUserToForm(foundForm.id, user.id);

    if (updatedForm) {
      foundForm = updatedForm;
    }
  }

  return (
    <GeneratedForm
      formId={foundForm.id}
      formTitle={foundForm.title}
      fields={foundForm.fields as FormFieldSchemaType[]}
      editable
      state={foundForm.state}
    />
  );
}
