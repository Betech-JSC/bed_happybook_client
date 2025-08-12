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

      phone: z
        .string()
        .min(1, {
          message: messages.required,
        })
        .regex(/^\d{10,11}$/, {
          message: messages.inValid,
        }),

      name: z
        .string()
        .min(3, (messages.minLength as (length: number) => string)(3))
        .max(100, (messages.maxLength as (length: number) => string)(100)),

      password: z
        .string()
        .min(1, (messages.minLength as (length: number) => string)(1))
        .max(100, (messages.maxLength as (length: number) => string)(100)),

      password_confirmation: z
        .string()
        .min(1, (messages.minLength as (length: number) => string)(1))
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
