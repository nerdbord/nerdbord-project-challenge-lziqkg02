"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FormFieldSchemaType } from "/src/schema";
import { FormState } from "@prisma/client";
import { PublishFormButton } from "/src/components/PublishFormButton";
import { deleteFormById, saveAndPublishForm } from "/src/app/actions";
import { useCopyToClipboard } from "/src/hooks/useCopyToClipboard";
import { useUnsavedChangesWarning } from "/src/hooks/useUnsavedChangesWarning";
import { useFormState } from "react-dom";
import { FieldContextEditingMenu } from "/src/components/FieldContextEditingMenu";
//@ts-ignore
import DOMPurify from "dompurify";
import {
  TrashIcon,
  PlusIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

type Props = {
  formId: string;
  formTitle: string;
  fields: FormFieldSchemaType[];
  editable?: boolean;
  userId?: string;
  state: FormState;
  webhookUrl?: string;
};

const initialState = {
  message: "",
};

export const GeneratedForm: React.FC<Props> = ({
  formId,
  formTitle: initialTitle,
  fields: initialFields,
  editable = false,
  state,
  userId,
  webhookUrl,
}) => {
  const [formState, setFormState] = useState<{ [key: string]: any }>({});
  const [fields, setFields] = useState<FormFieldSchemaType[]>(initialFields);
  const [formTitle, setFormTitle] = useState(initialTitle);
  const [selectedField, setSelectedField] =
    useState<FormFieldSchemaType | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [webhookUrlInput, setWebhookUrlInput] = useState(webhookUrl || "");

  const formTitleRef = useRef<HTMLHeadingElement>(null);

  const router = useRouter();
  const isFormPublished = state === FormState.PUBLISHED;

  const [_state, saveAndPublish] = useFormState(
    saveAndPublishForm,
    initialState,
  );

  useUnsavedChangesWarning(
    !isFormPublished,
    "Are you sure you want to leave? Save your form or it will be lost.",
    () => {
      deleteFormById(formId);
    },
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
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.name === prevName ? updatedField : field,
      ),
    );

    setSelectedField(null);
    setContextMenuPosition(null);
  };

  const handleFieldDelete = (fieldName: string) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field.name !== fieldName),
    );
  };

  const handleAddField = (e: React.MouseEvent) => {
    const newField: FormFieldSchemaType = {
      name: `field_${fields.length + 1}`,
      label: `New Field ${fields.length + 1}`,
      type: "text",
      required: false,
      value: "",
    };
    setFields([...fields, newField]);
    setSelectedField(newField);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const sanitizeInput = (input: string | null) => {
    return DOMPurify.sanitize(input || "");
  };

  const handleTitleBlur = () => {
    if (formTitleRef.current) {
      const sanitizedTitle = sanitizeInput(formTitleRef.current.textContent);
      setFormTitle(sanitizedTitle);
    }
  };

  const handleWebhookSave = () => {
    setShowWebhookModal(false);
    // Save webhook URL logic here, if necessary
  };

  const renderInputField = (field: FormFieldSchemaType) => {
    const commonProps = {
      className: "input input-bordered w-full",
      required: field.required,
      value: formState[field.name] || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        handleChange(field.name, e.target.value),
    };

    const renderField = () => {
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
            <select {...commonProps} className="select select-bordered w-full">
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
                <label key={option} className="label cursor-pointer">
                  <span className="label-text mr-4">{option}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    className={field.type === "radio" ? "radio" : "checkbox"}
                    value={option}
                    checked={
                      field.type === "radio"
                        ? formState[field.name] === option
                        : formState[field.name]?.includes(option)
                    }
                    onChange={(event) => {
                      event.stopPropagation();
                      handleChange(
                        field.name,
                        field.type === "checkbox"
                          ? formState[field.name]?.includes(option)
                            ? formState[field.name].filter(
                                (val: string) => val !== option,
                              )
                            : [...(formState[field.name] || []), option]
                          : option,
                      );
                    }}
                  />
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
        <div className="flex items-center justify-between">
          {renderField()}
          {editable && (
            <button
              type="button"
              className="ml-2 btn btn-outline btn-error"
              onClick={(e) => {
                e.stopPropagation();
                handleFieldDelete(field.name);
              }}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {editable && (
        <button
          className="link link-hover"
          onClick={() => {
            if (isFormPublished) {
              router.back();
              return;
            }
            setShowExitModal(true);
          }}
        >
          &larr; Back
        </button>
      )}
      <div className="p-[60px] rounded-lg relative max-w-[901px] mx-auto">
        {editable && (
          <div
            className="inline-flex items-center bg-blue-100 border border-dashed border-blue-300 text-blue-900 text-sm rounded-lg p-2 mb-4"
            role="alert"
          >
            <InformationCircleIcon width={24} />
            <span className="ml-1">Click on question to edit</span>
          </div>
        )}
        <h1
          className={`text-2xl font-bold mb-5 ${editable ? "underline cursor-pointer" : ""}`}
          contentEditable={editable}
          onBlur={handleTitleBlur}
          ref={formTitleRef}
        >
          {formTitle}
        </h1>
        <form action={webhookUrl}>
          {fields.map((field) => renderInputField(field))}
          {editable && (
            <div className="flex items-center">
              <button type="button" className="btn" onClick={handleAddField}>
                Add new field
                <PlusIcon width={20} />
              </button>
            </div>
          )}
          {!editable && (
            <button className="btn btn-primary mt-5 w-[420px]">
              Submit your answers
            </button>
          )}
        </form>
        {editable && (
          <div className="flex justify-end mt-5">
            {!webhookUrl ? (
              <button
                className="btn btn-primary"
                onClick={() => setShowWebhookModal(true)}
              >
                Set where form data should be sent to
              </button>
            ) : (
              <>
                <form className={"mr-2"} action={saveAndPublish}>
                  <textarea
                    hidden
                    value={JSON.stringify(fields)}
                    name={"fields"}
                  ></textarea>
                  <input
                    type="text"
                    name={"formName"}
                    hidden
                    value={formTitle}
                  />
                  <PublishFormButton formId={formId} />
                </form>
                <button
                  className="btn btn-outline"
                  onClick={() => setShowWebhookModal(true)}
                >
                  Change where form should send data to
                </button>
              </>
            )}
          </div>
        )}
        {selectedField && contextMenuPosition && (
          <FieldContextEditingMenu
            field={selectedField}
            onSave={handleFieldSave}
            onClose={() => setSelectedField(null)}
            style={{
              width: 388,
              top: contextMenuPosition.y - 200,
              left: contextMenuPosition.x - 300,
            }}
          />
        )}
        {showWebhookModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <form action={saveAndPublish}>
                {!webhookUrl && (
                  <div>
                    <textarea
                      hidden
                      value={JSON.stringify(fields)}
                      name={"fields"}
                    ></textarea>
                    <input
                      type="text"
                      name={"formName"}
                      hidden
                      value={formTitle}
                    />
                  </div>
                )}
                <h3 className="font-bold text-lg">Set Webhook URL</h3>
                <p className="py-4">
                  Enter the URL where form data should be sent:
                </p>
                <input
                  type="text"
                  name={"webhookUrl"}
                  className="input input-bordered w-full mb-4"
                  value={webhookUrlInput}
                  required
                  onChange={(e) => setWebhookUrlInput(e.target.value)}
                  placeholder="https://example.com/webhook"
                />
                <div className="modal-action">
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowWebhookModal(false)}
                  >
                    Cancel
                  </button>
                  <PublishFormButton formId={formId} />
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Exit Form Edition Modal */}
        {showExitModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4">
                Are you sure you want to leave? Save your form or it will be
                lost.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowExitModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => {
                    router.back();
                    deleteFormById(formId);
                  }}
                >
                  Exit form edition
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
