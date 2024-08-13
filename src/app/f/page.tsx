import React from "react";
import { BackButton } from "/src/components/BackButton";
import { getFormsByState } from "/src/app/actions";
import { FormState } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormCard } from "/src/components/FormCard";

const FormsPage = async () => {
  const forms = await getFormsByState(FormState.PUBLISHED);

  return (
    <div className="p-5 font-sans">
      <BackButton />
      <h1 className="text-2xl font-bold mb-5">Your forms</h1>
      <div className="grid grid-cols-4 gap-6">
        {forms.map((form, index) => (
          <FormCard id={form.id} key={index} title={form.title} answers={0} />
        ))}
        <FormCard title="Create new form" answers={0} isNew />
      </div>
    </div>
  );
};

export default FormsPage;
