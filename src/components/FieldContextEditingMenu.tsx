import React, { useEffect, useState } from "react";
import { FormFieldSchemaType } from "/src/schema";
import { regenerateFormField } from "/src/app/actions";

const regenerationPrompts = [
  "Change to select and add 5 options for favorite colors.",
  "Change to text and set the placeholder to 'Enter your full name'.",
  "Change to radio and add options for Yes, No, and Maybe.",
  "Change to checkbox and add options for newsletter preferences.",
  "Change to date and set the label to 'Select your birthdate'.",
  "Change to number and set the placeholder to 'Enter your age'.",
  "Change to select and add 10 default options with dog breeds.",
  "Change to text and set the label to 'Enter your email address'.",
  "Change to time and set the placeholder to 'Select preferred meeting time'.",
  "Change to radio and add options for gender: Male, Female, Non-binary.",
  "Change to checkbox and add options for selecting hobbies.",
  "Change to select and add 5 default options for payment methods.",
  "Change to text and set the placeholder to 'Enter your city of residence'.",
  "Change to date and set the label to 'Choose your appointment date'.",
  "Change to number and set the label to 'Enter your house number'.",
  "Change to radio and add options for communication preferences: Email, Phone, SMS.",
  "Change to checkbox and add options for dietary restrictions.",
  "Change to select and add 8 default options for countries.",
  "Change to text and set the placeholder to 'Enter your job title'.",
  "Change to time and set the label to 'Select your preferred start time'.",
];

type ContextMenuProps = {
  field: FormFieldSchemaType;
  onSave: (prevName: string, updatedField: FormFieldSchemaType) => void;
  onClose: () => void;
  style?: any;
};

export const FieldContextEditingMenu: React.FC<ContextMenuProps> = ({
  field,
  onSave,
  onClose,
  style,
}) => {
  const [editedField, setEditedField] = useState(field);
  const [prompt, setPrompt] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const randomPrompt =
      regenerationPrompts[
        Math.floor(Math.random() * regenerationPrompts.length)
      ];
    setPrompt(randomPrompt);
  }, [field]);

  const handleRegenerate = async () => {
    if (isRegenerating) {
      return;
    }

    setIsRegenerating(true);
    try {
      // Simulate an API call to regenerate the field based on the prompt
      const regeneratedField = await regenerateFormField(prompt, field);

      // Update the field with the regenerated data
      setEditedField(regeneratedField);

      // Automatically save and close the context menu after regeneration
      onSave(field.name, regeneratedField);
      setIsRegenerating(false);
      onClose();
    } catch (error) {
      setIsRegenerating(false);
      console.error("Error regenerating field:", error);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div
      style={style}
      className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-4"
    >
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">
          Edit {field.label} field
        </label>
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter a prompt"
        />
      </div>
      <div className="flex justify-between">
        <button
          disabled={isRegenerating}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleRegenerate}
        >
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </button>
        <button
          className="px-4 py-2 text-blue-500 rounded-md"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
