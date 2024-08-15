"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormFieldSchemaType } from "/src/schema";
import { FormState } from "@prisma/client";
import { PublishFormButton } from "/src/components/PublishFormButton";
import { saveAndPublishForm } from "/src/app/actions";
import { useCopyToClipboard } from "/src/hooks/useCopyToClipboard";
import { useUnsavedChangesWarning } from "/src/hooks/useUnsavedChangesWarning";
import { useFormState } from "react-dom";
import { FieldContextEditingMenu } from "/src/components/FieldContextEditingMenu";

type Props = {
  formId: string;
  formTitle: string;
  fields: FormFieldSchemaType[];
  editable?: boolean;
  userId?: string;
  state: FormState;
};

const initialState = {
  message: "",
};

export const GeneratedForm: React.FC<Props> = ({
  formId,
  formTitle,
  fields: initialFields,
  editable = false,
  state,
  userId,
}) => {
  const [formState, setFormState] = useState<{ [key: string]: any }>({});
  const [fields, setFields] = useState<FormFieldSchemaType[]>(initialFields);
  const [selectedField, setSelectedField] =
    useState<FormFieldSchemaType | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const router = useRouter();
  const isFormPublished = state === FormState.PUBLISHED;

  const [_state, saveAndPublish, pending] = useFormState(
    saveAndPublishForm,
    initialState,
  );

  useUnsavedChangesWarning(
    !isFormPublished,
    "Are you sure you want to leave? Save your form or it will be lost.",
  );

  const { copyText } = useCopyToClipboard();

  const handleChange = (name: string, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFieldClick = (
    field: FormFieldSchemaType,
    e: React.MouseEvent,
  ) => {
    if (editable) {
      if (selectedField?.name !== field.name) {
        setSelectedField(field);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
      } else {
        setSelectedField(null);
        setContextMenuPosition(null);
      }
    }
  };

  const handleFieldSave = (
    prevName: string,
    updatedField: FormFieldSchemaType,
  ) => {
    console.log("updatedField", updatedField);
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.name === prevName ? updatedField : field,
      ),
    );
    console.log("fields", fields);
    setSelectedField(null);
    setContextMenuPosition(null);
  };

  const renderInputField = (field: FormFieldSchemaType) => {
    const commonProps = {
      className: "w-full p-2 border border-gray-300 rounded-md",
      value: formState[field.name] || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        handleChange(field.name, e.target.value),
    };

    const renderField = () => {
      console.log("field", field);

      switch (field.type) {
        case "text":
        case "number":
        case "date":
        case "time":
          return (
            <input
              type={field.type}
              placeholder={field.placeholder || `Enter ${field.type}`}
              {...commonProps}
            />
          );
        case "select":
          return (
            <select {...commonProps}>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        case "radio":
        case "checkbox":
          return (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type={field.type}
                    name={field.name}
                    value={option}
                    checked={
                      field.type === "radio"
                        ? formState[field.name] === option
                        : formState[field.name]?.includes(option)
                    }
                    onChange={() =>
                      handleChange(
                        field.name,
                        field.type === "checkbox"
                          ? formState[field.name]?.includes(option)
                            ? formState[field.name].filter(
                                (val: string) => val !== option,
                              )
                            : [...(formState[field.name] || []), option]
                          : option,
                      )
                    }
                  />
                  <span className="text-gray-500">{option}</span>
                </label>
              ))}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div
        key={field.name}
        className="mb-5 relative"
        onClick={(e) => handleFieldClick(field, e)}
      >
        <label className="block font-bold mb-2">{field.label}</label>
        {renderField()}
      </div>
    );
  };

  return (
    <div className="p-5">
      {editable && (
        <div
          className="text-lg mb-5 cursor-pointer"
          onClick={() => router.back()}
        >
          &larr; Back
        </div>
      )}
      <div className="bg-gray-200 p-10 rounded-lg relative">
        <h1 className="text-2xl font-bold mb-5">{formTitle}</h1>
        <form>{fields.map((field) => renderInputField(field))}</form>
        {editable && (
          <div className="flex justify-between mt-5">
            <form action={saveAndPublish}>
              <textarea
                hidden
                value={JSON.stringify(fields)}
                name={"fields"}
              ></textarea>
              <PublishFormButton formId={formId} />
            </form>
            {isFormPublished && (
              <button
                type="button"
                onClick={() =>
                  copyText(`${window.location.origin}/f/${formId}`)
                }
                className="px-4 py-2 bg-black text-white rounded-md text-lg"
              >
                Share form
              </button>
            )}
          </div>
        )}
        {!editable && (
          <button className="px-4 py-2 border border-black rounded-md text-lg mt-5">
            Submit form
          </button>
        )}
        {selectedField && contextMenuPosition && (
          <FieldContextEditingMenu
            field={selectedField}
            onSave={handleFieldSave}
            onClose={() => setSelectedField(null)}
            style={{
              width: 520,
              top: contextMenuPosition.y - 200,
              left: contextMenuPosition.x + 150,
            }}
          />
        )}
      </div>
    </div>
  );
};
