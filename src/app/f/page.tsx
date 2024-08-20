import React from "react";
import { BackButton } from "/src/components/BackButton";
import { getUserFormsByState } from "/src/app/actions";
import { FormState } from "@prisma/client";
import { redirect } from "next/navigation";
import { FormCard } from "/src/components/FormCard";
import { currentUser } from "@clerk/nextjs/server";
import GenerateFormBtnIcon from "/src/components/icons/GenerateFormBtnIcon";
import Link from "next/link";
import { SignedIn, SignOutButton, UserButton } from "@clerk/nextjs";

const FormsPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const forms = await getUserFormsByState(user.id, FormState.PUBLISHED);

  return (
    <div className="p-8 font-sans relative">
      <header className="flex justify-between items-center">
        <div>
          <p className="text-[20px] text-[#334155]">
            Hello, {user.firstName || user.emailAddresses[0].emailAddress}!
          </p>
          <h1 className="text-3xl font-bold mb-8">Your instant forms</h1>
        </div>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {forms.map((form, index) => (
          <FormCard
            id={form.id}
            key={index}
            title={form.title}
            state={form.state}
          />
        ))}
      </div>
      <Link
        href={"/"}
        className="btn btn-primary py-2 text-white fixed bottom-8 right-8"
      >
        {"Generate new form"} <GenerateFormBtnIcon />
      </Link>
    </div>
  );
};

export default FormsPage;
