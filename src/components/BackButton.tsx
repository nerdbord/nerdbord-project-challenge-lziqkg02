"use client";
import React from "react";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.back();
      }}
      className="bg-none border-none text-lg cursor-pointer mb-5"
    >
      &larr; Back
    </button>
  );
};
