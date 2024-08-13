"use client";
import React from "react";
import { useRouter } from "next/navigation";

export type FormCardProps = {
  id?: string;
  title: string;
  answers: number;
  isNew?: boolean;
};

export const FormCard: React.FC<FormCardProps> = ({
  title,
  answers,
  isNew,
  id,
}) => {
  const { push } = useRouter();
  return (
    <div
      onClick={() => {
        const path = !id ? "/" : `/f/${id}/edit`;
        push(path);
      }}
      className="text-center text-black text-sm flex items-center flex-col min-w-[244px]"
    >
      <div
        className={`w-full h-[244px] rounded-lg bg-gray-300 mb-2 relative ${isNew ? "flex items-center justify-center" : ""}`}
      >
        {isNew && <span className="text-4xl text-black">+</span>}
      </div>
      <div className="font-bold text-center">{title}</div>
      {!isNew && (
        <div className="text-gray-500 text-center">{answers} answers</div>
      )}
    </div>
  );
};
