import { z } from "zod";

// Define the schema for a single form field
export const FormFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  value: z.union([z.string(), z.number(), z.null()]), // The initial value, if any
  type: z.enum([
    "text",
    "number",
    "date",
    "select",
    "checkbox",
    "radio",
    "time",
  ]), // Define the allowed input types
  placeholder: z.string().optional(), // Placeholder text, if any
  required: z.boolean().optional().describe("Whether the field is required"),
  options: z.array(z.string()).optional(), // Optional array for select input types
});

// Define the schema for the entire form
export const FormSchema = z.object({
  name: z.string().describe("The name of the form"),
  fields: z.array(FormFieldSchema),
});

export type FormFieldSchemaType = z.infer<typeof FormFieldSchema>;

export type FormSchemaType = z.infer<typeof FormSchema>;
