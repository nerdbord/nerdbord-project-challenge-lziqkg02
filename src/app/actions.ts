"use server";
import { generateObject } from "ai";
import { openai } from "../openAI";
import { prisma } from "../lib/prisma";
import {
  FormFieldSchema,
  FormFieldSchemaType,
  FormSchema,
  FormSchemaType,
} from "/src/schema";
import { redirect } from "next/navigation";
import { FormState, Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

export async function generateForm(prevState: any, formData: FormData) {
  const prompt = formData.get("prompt") as string;

  if (!prompt) {
    return {
      message: "Prompt is required",
    };
  }

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt,
    schema: FormSchema,
  });

  const savedForm = await saveForm(object.name, object.fields);
  redirect(`/f/${savedForm.id}/edit`); // Navigate to the new post page
  revalidateTag("forms"); // Update cached posts
}

export async function regenerateFormField(
  prompt: string,
  prevField: FormFieldSchemaType,
) {
  //
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: `
        Update previous form field data based on the prompt: "${prompt}. Change only what is necessary."
        
        Previous field data:
        ${JSON.stringify(prevField)}
    `,
    schema: FormFieldSchema,
  });
  return object;
}

export const sendFormDataToWebhook = async (
  prevState: any,
  formData: FormData,
) => {
  const webhookUrl = formData.get("webhookUrl") as string;

  if (!webhookUrl) {
    return {
      message: "WebhookUrl not found",
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    body: formData,
  });

  redirect("/confirmation");
};

export const saveAndPublishForm = async (
  prevState: any,
  formData: FormData,
) => {
  const formId = formData.get("formId") as string;
  const formName = formData.get("formName") as string;
  const webhookUrl = formData.get("webhookUrl") as string;
  const fields = formData.get("fields") as string;

  console.log("formId", formId);
  console.log("formName", formName);
  console.log("webhookUrl", webhookUrl);

  if (!formId) {
    return {
      message: "formId is required",
    };
  }

  const foundForm = await getForm(formId);

  if (!foundForm) {
    return {
      message: "Form not found",
    };
  }

  if (!formName) {
    return {
      message: "Form name not found",
    };
  }

  if (!webhookUrl) {
    return {
      message: "WebhookUrl not found",
    };
  }

  const updatedForm = await updateForm(foundForm.id, {
    title: formName,
    state: FormState.PUBLISHED,
    webhookUrl,
    fields: JSON.parse(fields) as FormSchemaType[],
  });

  redirect(`/f`); // Navigate to the new post page
  revalidatePath("/f"); // Update cached posts
};

export async function saveForm(title: string, fields: any) {
  try {
    const form = await prisma.form.create({
      data: {
        title,
        fields,
      },
    });
    return form;
  } catch (error) {
    console.error("Error saving form:", error);
    throw new Error("Failed to save form");
  }
}

export async function getForm(id: string) {
  try {
    const form = await prisma.form.findUnique({
      where: {
        id,
      },
    });
    return form;
  } catch (error) {
    console.error("Error getting form:", error);
    throw new Error("Failed to get form");
  }
}

export async function getUserFormsByState(userId: string, state: FormState) {
  try {
    const forms = await prisma.form.findMany({
      where: {
        clerkUserId: userId,
        state,
      },
    });
    return forms;
  } catch (error) {
    console.error("Error finding forms:", error);
    throw new Error("Failed to find forms");
  }
}

export async function updateForm(id: string, data: Prisma.FormUpdateInput) {
  try {
    const form = await prisma.form.update({
      where: {
        id,
      },
      data,
    });
    return form;
  } catch (error) {
    console.error("Error updating form:", error);
    throw new Error("Failed to update form");
  }
}

export async function tryConnectUserToForm(
  formId: string,
  clerkUserId: string,
) {
  const form = await prisma.form.findUnique({
    where: {
      id: formId,
    },
  });

  if (!form) {
    return null;
  }

  if (form.clerkUserId) {
    return null;
  }

  const updatedForm = await updateForm(formId, {
    clerkUserId,
  });

  return updatedForm;
}

export async function deleteFormById(id: string) {
  try {
    await prisma.form.delete({
      where: {
        id,
      },
    });

    revalidatePath("/f");
  } catch (error) {
    console.error("Error deleting form:", error);
    throw new Error("Failed to delete form");
  }
}

export async function deleteUserFormById(id: string, userId: string) {
  try {
    const form = await prisma.form.findUnique({
      where: {
        id,
      },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    if (form.clerkUserId !== userId) {
      throw new Error("User does not own form");
    }

    await prisma.form.delete({
      where: {
        id,
      },
    });

    revalidatePath("/f");
  } catch (error) {
    console.error("Error deleting form:", error);
    throw new Error("Failed to delete form");
  }
}
