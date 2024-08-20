import React from "react";
import Link from "next/link";

const FormSubmissionConfirmation: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-center">
      <main className="max-w-[434px] mx-auto px-4">
        <h1 className="text-3xl font-semibold text-center text-[#4338CA] leading-[40px] font-roboto mb-4">
          Your form has been successfully sent!
        </h1>
        <h2 className="text-center text-[16px] font-roboto leading-[24px] text-[#94A3B8] mb-8">
          Thank you for your submission.
        </h2>
        <Link href="/">
          <button className="btn btn-primary w-full">Create my own form</button>
        </Link>
      </main>
    </div>
  );
};

export default FormSubmissionConfirmation;
