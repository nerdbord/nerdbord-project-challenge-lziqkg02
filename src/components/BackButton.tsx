"use client";
import React from "react";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();
  return (
    <button className="link link-hover" onClick={() => router.back()}>
      &larr; Back
    </button>
  );
};
