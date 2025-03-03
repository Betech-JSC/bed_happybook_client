// src/schemas/authRegister.schema.ts
import { ValidationMessages } from "@/lib/messages";
import z from "zod";

export const getAuthRegisterSchema = (messages: ValidationMessages) => {
  return z
    .object({
      email: z
        .string()
        .min(1, (messages.minLength as (length: number) => string)(1))
        .email(messages.email as string),

      password: z
        .string()
        .min(6, (messages.minLength as (length: number) => string)(6))
        .max(100, (messages.maxLength as (length: number) => string)(100)),

      password_confirmation: z
        .string()
        .min(6, (messages.minLength as (length: number) => string)(6))
        .max(100, (messages.maxLength as (length: number) => string)(100)),
    })
    .superRefine(({ password_confirmation, password }, ctx) => {
      if (password_confirmation !== password) {
        ctx.addIssue({
          code: "custom",
          message: messages.passwordMismatch as string,
          path: ["password_confirmation"],
        });
      }
    });
};

export type AuthRegisterSchemaType = z.infer<
  ReturnType<typeof getAuthRegisterSchema>
>;
