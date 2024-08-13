"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { FormFieldSchemaType } from "/src/schema";
import { FormState } from "@prisma/client";
import { PublishFormButton } from "/src/components/PublishFormButton";
import { saveAndPublishForm } from "/src/app/actions";

type Props = {
  formId: string;
  formTitle: string;
  fields: FormFieldSchemaType[];
  editable?: boolean;
  state: FormState;
};

const initialState = {
  message: "",
};

export const GeneratedForm: React.FC<Props> = ({
  formId,
  formTitle,
  fields,
  editable,
  state,
}) => {
  const [formState, setFormState] = useState<{ [key: string]: any }>({});
  const router = useRouter();
  const isFormPublished = state === FormState.PUBLISHED;
  const [_state, saveAndPublish, pending] = useFormState(
    saveAndPublishForm,
    initialState,
  );

  const handleChange = (name: string, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const renderInputField = (field: FormFieldSchemaType) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.name} className="mb-5">
            <label className="block font-bold mb-2">{field.label}</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={field.placeholder || "Enter value"}
              value={formState[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </div>
        );
      case "number":
        return (
          <div key={field.name} className="mb-5">
            <label className="block font-bold mb-2">{field.label}</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={field.placeholder || "Enter value"}
              value={formState[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </div>
        );
      case "date":
        return (
          <div key={field.name} className="mb-5">
            <label className="block font-bold mb-2">{field.label}</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formState[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </div>
        );
      case "select":
        return (
          <div key={field.name} className="mb-5">
            <label className="block font-bold mb-2">{field.label}</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formState[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      case "radio":
        return (
          <div key={field.name} className="radio-group mb-5">
            <label className="block font-bold mb-2">{field.label}</label>
            {field.options?.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={formState[field.name] === option}
                  onChange={() => handleChange(field.name, option)}
                />{" "}
                <span className="block ml-6 text-gray-500 text-sm">
                  {" "}
                  {option}
                </span>
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div key={field.name} className="radio-group mb-5">
            <label className="block font-bold mb-2">{field.label}</label>
            {field.options?.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  name={field.name}
                  value={option}
                  checked={formState[field.name] === option}
                  onChange={() => handleChange(field.name, option)}
                />{" "}
                <span className="block ml-6 text-gray-500 text-sm">
                  {" "}
                  {option}
                </span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5">
      {editable && (
        <div className="text-lg mb-5 cursor-pointer">
          <span
            onClick={() => {
              router.back();
            }}
          >
            &larr; Back
          </span>
        </div>
      )}
      <div className="bg-gray-200 p-10 rounded-lg">
        <h1 className="text-2xl font-bold mb-5">{formTitle}</h1>
        <form>{fields.map((field) => renderInputField(field))}</form>
        {editable && (
          <div className="flex justify-between">
            <form action={saveAndPublish}>
              <PublishFormButton formId={formId} />
            </form>
            {isFormPublished && (
              <button className="px-4 py-2 bg-black text-white rounded-md text-lg">
                Share form
              </button>
            )}
          </div>
        )}
        {!editable && (
          <button className="px-4 py-2 border border-black rounded-md text-lg">
            Submit form
          </button>
        )}
      </div>
    </div>
  );
};
