import React, { useEffect, useState } from "react";
import { FormFieldSchemaType } from "/src/schema";
import { regenerateFormField } from "/src/app/actions";

const regenerationPrompts = [
  "Change label to {New Label}",
  "Change placeholder to {New Placeholder}",
  "Change input type to {New input type}",
  "Add options {Option1, Option2} to the field",
  "Set required status to {true / false}",
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

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div
      style={style}
      className="absolute bg-white rounded-lg shadow-lg p-6 w-96"
    >
      <h2 className="text-xl font-semibold mb-3">Edit "{field.label}" field</h2>
      <textarea
        value={prompt}
        onChange={handlePromptChange}
        className="textarea textarea-bordered w-full mb-4 resize-none"
        placeholder="What do you want to change?"
      />
      <div className="text-sm font-semibold mb-3">Suggestion for you</div>
      <div className="space-y-2">
        {regenerationPrompts.slice(0, 3).map((suggestion, index) => (
          <button
            key={index}
            className="btn btn-ghost btn-sm w-full justify-start"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            ✨ {suggestion}
          </button>
        ))}
      </div>
      <div className="flex justify-end mt-6 space-x-2">
        <button
          className="btn btn-link text-gray-900 no-underline"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          disabled={isRegenerating}
          className={`btn btn-primary ${isRegenerating ? "loading" : ""}`}
          onClick={handleRegenerate}
        >
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </button>
      </div>
    </div>
  );
};
