"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "/src/components/DropdownMenu";
import { useCopyToClipboard } from "/src/hooks/useCopyToClipboard";
import { FormState } from "@prisma/client";
import { useSession } from "@clerk/nextjs";
import { deleteUserFormById } from "/src/app/actions";

export type FormCardProps = {
  id?: string;
  title: string;
  answers: number;
  isNew?: boolean;
  state?: FormState;
};

export const FormCard: React.FC<FormCardProps> = ({
  title,
  answers,
  isNew,
  id,
  state,
}) => {
  const { push } = useRouter();
  const { copyText } = useCopyToClipboard();
  const { session } = useSession();
  const isPublished = state === FormState.PUBLISHED;

  const actions = [
    {
      title: "Edit",
      onClick: () => {
        push(`/f/${id}/edit`);
      },
    },
  ];

  if (isPublished) {
    actions.push(
      {
        title: "Preview",
        onClick: () => {
          push(`/f/${id}`);
        },
      },
      {
        title: "Share",
        onClick: () => {
          copyText(`${window.location.origin}/f/${id}`);
        },
      },
    );
  }

  id &&
    session?.id &&
    actions.push({
      title: "Delete",
      onClick: async () => {
        await deleteUserFormById(id, session.user.id);
      },
    });

  return (
    <div
      onClick={() => {
        if (isNew) {
          push("/");
        }
      }}
      className="relative text-center text-black text-sm flex items-center flex-col min-w-[244px]"
    >
      <div
        className={`w-full h-[244px] rounded-lg bg-gray-300 mb-2 relative ${isNew ? "flex items-center justify-center" : ""}`}
      >
        {isNew && <span className="text-4xl text-black">+</span>}
      </div>
      <div className={"absolute right-0 top-0 w-4"}>
        {!isNew && <DropdownMenu actions={actions} />}
      </div>
      <div className="font-bold text-center">{title}</div>
      {!isNew && (
        <div className="text-gray-500 text-center">{answers} answers</div>
      )}
    </div>
  );
};
